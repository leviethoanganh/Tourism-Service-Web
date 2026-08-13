import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../../middlewares/admin.auth.middleware";
import * as authController from "../../controllers/admin/auth.controller";
import * as dashboardController from "../../controllers/admin/dashboard.controller";
import * as tourController from "../../controllers/admin/tour.controller";
import * as categoryController from "../../controllers/admin/category.controller";
import * as orderController from "../../controllers/admin/order.controller";
import * as settingController from "../../controllers/admin/setting.controller";
import * as profileController from "../../controllers/admin/profile.controller";
import * as uploadController from "../../controllers/admin/upload.controller";
import * as userController from "../../controllers/admin/user.controller";
import { Storage } from "../../helpers/cloudinary.helper";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const cloudinaryUpload = multer({ storage: Storage });

// ─── Auth (no token required) ───────────────────────────────────────────────
router.post("/auth/login", authController.loginPost);
router.post("/auth/register", authController.registerPost);
router.post("/auth/forgot-password", authController.forgotPasswordPost);
router.post("/auth/otp-password", authController.otpPasswordPost);
router.post("/auth/reset-password", verifyToken, authController.resetPasswordPost);
router.get("/auth/logout", authController.logout);
router.get("/auth/check", verifyToken, authController.checkAuth);

// ─── Dashboard ───────────────────────────────────────────────────────────────
router.get("/dashboard", verifyToken, dashboardController.dashboard);
router.post("/dashboard/revenue-chart", verifyToken, dashboardController.revenueChartPost);

// ─── Tours ───────────────────────────────────────────────────────────────────
router.get("/tours", verifyToken, tourController.list);
router.get("/tours/form-data", verifyToken, tourController.getFormData);
router.get("/tours/trash", verifyToken, tourController.trash);
router.get("/tours/:id", verifyToken, tourController.getDetail);
router.post(
  "/tours",
  verifyToken,
  cloudinaryUpload.fields([{ name: "avatar", maxCount: 1 }, { name: "images", maxCount: 10 }]),
  tourController.createPost
);
router.patch(
  "/tours/:id",
  verifyToken,
  cloudinaryUpload.fields([{ name: "avatar", maxCount: 1 }, { name: "images", maxCount: 10 }]),
  tourController.editPatch
);
router.patch("/tours/:id/delete", verifyToken, tourController.deletePatch);
router.patch("/tours/:id/restore", verifyToken, tourController.undoPatch);
router.delete("/tours/:id", verifyToken, tourController.destroyDel);

// ─── Categories ──────────────────────────────────────────────────────────────
router.get("/categories", verifyToken, categoryController.list);
router.get("/categories/form-data", verifyToken, categoryController.getFormData);
router.get("/categories/:id", verifyToken, categoryController.getDetail);
router.post(
  "/categories",
  verifyToken,
  cloudinaryUpload.single("avatar"),
  categoryController.createPost
);
router.patch(
  "/categories/:id",
  verifyToken,
  cloudinaryUpload.single("avatar"),
  categoryController.editPatch
);
router.patch("/categories/:id/delete", verifyToken, categoryController.deletePatch);

// ─── Orders ──────────────────────────────────────────────────────────────────
router.get("/orders", verifyToken, orderController.list);
router.get("/orders/:id", verifyToken, orderController.getDetail);
router.patch("/orders/:id", verifyToken, orderController.editPatch);

// ─── Users ───────────────────────────────────────────────────────────────────
router.get("/users", verifyToken, userController.list);

// ─── Settings ────────────────────────────────────────────────────────────────
router.get("/settings/website-info", verifyToken, settingController.websiteInfo);
router.patch(
  "/settings/website-info",
  verifyToken,
  upload.fields([{ name: "logo", maxCount: 1 }, { name: "favicon", maxCount: 1 }]),
  settingController.websiteInfoPatch
);
router.get("/settings/accounts", verifyToken, settingController.accountAdminList);
router.post(
  "/settings/accounts",
  verifyToken,
  upload.single("avatar"),
  settingController.accountAdminCreatePost
);
router.patch(
  "/settings/accounts/:id",
  verifyToken,
  upload.single("avatar"),
  settingController.accountAdminEditPatch
);
router.get("/settings/roles", verifyToken, settingController.roleList);
router.post("/settings/roles", verifyToken, settingController.roleCreatePost);
router.get("/settings/roles/:id", verifyToken, settingController.roleGetDetail);
router.patch("/settings/roles/:id", verifyToken, settingController.roleEditPatch);

// ─── Profile ─────────────────────────────────────────────────────────────────
router.patch(
  "/profile",
  verifyToken,
  upload.single("avatar"),
  profileController.editPatch
);
router.patch("/profile/change-password", verifyToken, profileController.changePasswordPatch);

// ─── Upload ──────────────────────────────────────────────────────────────────
router.post(
  "/upload/image",
  verifyToken,
  cloudinaryUpload.single("image"),
  uploadController.imagePost
);

export default router;
