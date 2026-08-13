import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AccountAdmin from "../../models/account-admin.model";
import { AuthRequest } from "../../interfaces";

export const editPatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.account!.id;

    const existEmail = await AccountAdmin.findOne({
      _id: { $ne: id },
      email: req.body.email,
    });
    if (existEmail) {
      res.json({ code: "error", message: "Email already exists in the system!" });
      return;
    }

    if (req.file) {
      req.body.avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    } else {
      delete req.body.avatar;
    }

    req.body.updatedBy = id;

    await AccountAdmin.updateOne({ _id: id, deleted: false }, req.body);

    const token = jwt.sign(
      { id, email: req.body.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    res.json({ code: "success", message: "Profile updated successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Update failed!" });
  }
};

export const changePasswordPatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.account!.id;
    const { currentPassword, newPassword } = req.body;

    const account = await AccountAdmin.findOne({ _id: id, deleted: false });
    if (!account) {
      res.json({ code: "error", message: "Account not found!" });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, account.password as string);
    if (!isValid) {
      res.json({ code: "error", message: "Current password is incorrect!" });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await AccountAdmin.updateOne({ _id: id, deleted: false }, { password: passwordHash, updatedBy: id });

    res.json({ code: "success", message: "Password changed successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Failed to change password!" });
  }
};
