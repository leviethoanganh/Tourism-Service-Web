import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AccountAdmin from "../models/account-admin.model";
import Role from "../models/role.model";
import { AuthRequest } from "../interfaces";
import { authCookieOptions } from "../helpers/cookie.helper";

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Cookie = web (Next.js). Authorization header = mobile (React Native).
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : undefined);

    if (!token) {
      res.status(401).json({ code: "error", message: "Unauthorized. Please login." });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
    };

    const existAccount = await AccountAdmin.findOne({
      _id: decoded.id,
      email: decoded.email,
      status: "active",
      deleted: false,
    }).select("-password");

    if (!existAccount) {
      res.clearCookie("token", authCookieOptions());
      res.status(401).json({ code: "error", message: "Account not found or inactive." });
      return;
    }

    if (existAccount.role) {
      const role = await Role.findOne({ _id: existAccount.role, deleted: false });
      if (role) {
        (existAccount as any).roleName = role.name;
        req.pers = role.permissions as string[];
      }
    }

    req.account = existAccount as any;
    next();
  } catch (error) {
    res.clearCookie("token", authCookieOptions());
    res.status(401).json({ code: "error", message: "Invalid or expired token." });
  }
};
