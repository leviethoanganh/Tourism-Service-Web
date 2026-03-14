const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

// Kích hoạt plugin để tự động tạo slug từ tên tour
mongoose.plugin(slug);

const tourSchema = new mongoose.Schema(
    {
        name: String,
        category: String,
        position: Number,
        status: String,
        avatar: String,
        images: Array,
        priceAdult: Number,
        priceChildren: Number,
        priceBaby: Number,
        priceNewAdult: Number,
        priceNewChildren: Number,
        priceNewBaby: Number,
        stockAdult: Number,
        stockChildren: Number,
        stockBaby: Number,
        locations: Array,
        time: String,
        vehicle: String,
        departureDate: Date,
        information: String,
        schedules: Array,
        createdBy: String,
        updatedBy: String,
        slug: {
            type: String,
            slug: "name", // Tạo slug dựa trên trường "name"
            unique: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: String,
        deletedAt: Date
    },
    {
        timestamps: true // Tự động thêm createdAt và updatedAt
    }
);

// Tham số thứ 3 "tours" là tên collection trong MongoDB
const Tour = mongoose.model("Tour", tourSchema, "tours");

module.exports = Tour;