const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/admin/order.controller");

router.get("/list", orderController.list);
router.get("/edit/:id", orderController.edit);
router.patch("/edit/:id", orderController.editPatch);


module.exports = router;