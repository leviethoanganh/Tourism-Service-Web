import { Response } from "express";
import User from "../../models/user.model";
import { AuthRequest } from "../../interfaces";

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userList = await User.find({ deleted: false })
      .sort({ createdAt: "desc" })
      .select("-password");

    res.json({ code: "success", userList });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};
