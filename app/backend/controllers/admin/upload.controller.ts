import { Response } from "express";
import { AuthRequest } from "../../interfaces";

export const imagePost = (req: AuthRequest, res: Response): void => {
  if (req.file && (req.file as any).path) {
    res.json({ location: (req.file as any).path });
  } else {
    res.status(400).json({ error: "Upload failed!" });
  }
};
