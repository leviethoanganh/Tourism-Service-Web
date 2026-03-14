const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 0 // Tự động xóa bản ghi khi đến thời gian expireAt
        }
    },
    {
        timestamps: true // Tự động sinh ra trường createdAt và updatedAt
    }
);

const ForgotPassword = mongoose.model('ForgotPassword', schema, "forgot-password");

module.exports = ForgotPassword;