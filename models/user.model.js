const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        avatar: String,
        password: String,
        status: {
            type: String,
            default: "initial" // initial | active | inactive
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        // Tự động sinh ra createdAt và updatedAt
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
