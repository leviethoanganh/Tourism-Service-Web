import { CookieOptions } from "express";

// Frontend (Vercel) and backend (Render) live on different domains, so the
// auth cookie must be SameSite=None + Secure to survive cross-site requests.
// Chrome/Firefox/Edge treat http://localhost as a secure context too, so this
// also works unchanged in local dev.
export const authCookieOptions = (maxAge?: number): CookieOptions => ({
  ...(maxAge !== undefined ? { maxAge } : {}),
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
