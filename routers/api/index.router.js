const router = require("express").Router();
const tourController = require("../../controllers/api/tour.controller");
const settingController = require("../../controllers/api/setting.controller");
const orderController = require("../../controllers/api/order.controller");

router.get("/tours/home", tourController.home);
router.get("/tours/search", tourController.search);
router.get("/tours/:slug", tourController.detail);
router.get("/tours", tourController.list);

router.get("/settings", settingController.websiteInfo);
router.get("/categories", settingController.categories);
router.get("/cities", settingController.cities);

router.get("/orders/success", orderController.success);

module.exports = router;
