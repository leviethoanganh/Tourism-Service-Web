const mongoose = require("mongoose");

// Sửa từ .Plan() thành .Schema() để đúng cú pháp Mongoose
const orderSchema = new mongoose.Schema(
    {
        code: String,
        fullName: String,
        phone: String,
        note: String,
        items: Array,
        subTotal: Number,
        discount: Number,
        total: Number,
        paymentMethod: String, // money, bank, vnpay, zalopay
        paymentStatus: String,
        status: String,
        updatedBy: String,
        deleted: {
        type: Boolean,
        default: false
        },
        deletedBy: String,
        deletedAt: Date
    },
    {
        // Tự động sinh ra trường createdAt và updatedAt
        timestamps: true 
    }
);

// Tham số thứ 3 "orders" xác định tên collection trong MongoDB
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;