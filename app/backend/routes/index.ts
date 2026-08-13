import { Router } from "express";
import clientRoutes from "./client";
import adminRoutes from "./admin";

const router = Router();

router.use("/", clientRoutes);
router.use("/admin", adminRoutes);

export default router;
