const mongoose = require('mongoose');

// Sửa từ .Plan() thành .Schema()
const citySchema = new mongoose.Schema(
    {
        name: String
    },
    {
        timestamps: true // Thêm thời gian tạo/cập nhật nếu bạn cần
    }
);

// Tham số thứ 3 "cities" xác định tên collection trong MongoDB
const City = mongoose.model('City', citySchema, "cities");

module.exports = City;