import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AccountAdmin from "../../models/account-admin.model";
import ForgotPassword from "../../models/forgot-password.model";
import { generateRandomNumber } from "../../helpers/generate.helper";
import { sendMail } from "../../helpers/mail.helper";
import { AuthRequest } from "../../interfaces";
import { authCookieOptions } from "../../helpers/cookie.helper";

export const loginPost = async (req: Request, res: Response): Promise<void> => {
  const { email, password, rememberPassword } = req.body;

  const existAccount = await AccountAdmin.findOne({ email });
  if (!existAccount) {
    res.json({ code: "error", message: "Email does not exist in the system!" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, existAccount.password as string);
  if (!isPasswordValid) {
    res.json({ code: "error", message: "Incorrect password!" });
    return;
  }

  if (existAccount.status !== "active") {
    res.json({ code: "error", message: "Account is not activated!" });
    return;
  }

  const token = jwt.sign(
    { id: existAccount.id, email: existAccount.email },
    process.env.JWT_SECRET as string,
    { expiresIn: rememberPassword ? "7d" : "1d" }
  );

  res.cookie(
    "token",
    token,
    authCookieOptions(rememberPassword ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
  );

  res.json({ code: "success", message: "Login successful!", token });
};

export const registerPost = async (req: Request, res: Response): Promise<void> => {
  const existAccount = await AccountAdmin.findOne({ email: req.body.email });
  if (existAccount) {
    res.json({ code: "error", message: "Email already exists in the system!" });
    return;
  }

  req.body.status = "initial";
  req.body.deleted = false;
  req.body.password = await bcrypt.hash(req.body.password, 10);

  const newAccount = new AccountAdmin(req.body);
  await newAccount.save();

  res.json({ code: "success", message: "Registration successful!" });
};

export const forgotPasswordPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const existAccount = await AccountAdmin.findOne({ email, status: "active" });
    if (!existAccount) {
      res.json({ code: "error", message: "Email not found or account is locked!" });
      return;
    }

    const existOTP = await ForgotPassword.findOne({ email });
    if (existOTP) {
      res.json({ code: "error", message: "Please wait 5 minutes before requesting a new code!" });
      return;
    }

    const otp = generateRandomNumber(4);

    const record = new ForgotPassword({
      email,
      otp,
      expireAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await record.save();

    const subject = "Password recovery OTP code";
    const content = `Your OTP code is: <b>${otp}</b>. Valid for 5 minutes. Do not share this code.`;
    sendMail(email, subject, content);

    res.json({ code: "success", message: "OTP code has been sent to your email!" });
  } catch (error) {
    res.json({ code: "error", message: "An error occurred, please try again!" });
  }
};

export const otpPasswordPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const existAccount = await AccountAdmin.findOne({ email, status: "active" });
    if (!existAccount) {
      res.json({ code: "error", message: "Email does not exist in the system!" });
      return;
    }

    const existRecord = await ForgotPassword.findOne({ email, otp });
    if (!existRecord) {
      res.json({ code: "error", message: "Invalid or expired OTP code!" });
      return;
    }

    await ForgotPassword.deleteOne({ email, otp });

    const token = jwt.sign(
      { id: existAccount.id, email: existAccount.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, authCookieOptions(24 * 60 * 60 * 1000));

    res.json({ code: "success", message: "OTP verified successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "An error occurred, please try again!" });
  }
};

export const resetPasswordPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    await AccountAdmin.updateOne({ _id: req.account!.id }, { password: passwordHash });

    res.json({ code: "success", message: "Password changed successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "An error occurred, please try again!" });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token", authCookieOptions());
  res.json({ code: "success", message: "Logged out successfully!" });
};

export const checkAuth = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ code: "success", account: req.account });
};
