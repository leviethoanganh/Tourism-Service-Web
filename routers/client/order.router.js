const express = require("express");
const router = express.Router();

// Đường dẫn trỏ tới controller xử lý đơn hàng
const orderController = require("../../controllers/client/order.controller");

// Route nhận dữ liệu đặt hàng từ frontend gửi lên
router.post("/create", orderController.createPost);

router.get('/success', orderController.success);

router.get('/payment-zalopay', orderController.paymentZaloPay);

module.exports = router;