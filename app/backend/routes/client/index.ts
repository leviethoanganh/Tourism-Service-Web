import { Router } from "express";
import * as tourController from "../../controllers/client/tour.controller";
import * as orderController from "../../controllers/client/order.controller";
import * as settingController from "../../controllers/client/setting.controller";
import * as contactController from "../../controllers/client/contact.controller";

const router = Router();

// Tours
router.get("/tours/home", tourController.home);
router.get("/tours/search", tourController.search);
router.get("/tours/:slug", tourController.detail);
router.get("/tours", tourController.list);

// Orders
router.post("/orders/create", orderController.createPost);
router.get("/orders/success", orderController.success);

// Settings
router.get("/settings", settingController.websiteInfo);
router.get("/categories", settingController.categories);
router.get("/cities", settingController.cities);

// Contact
router.post("/contact", contactController.sendContact);

export default router;
