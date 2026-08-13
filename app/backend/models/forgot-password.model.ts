import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: { type: Date, expires: 0 },
  },
  { timestamps: true }
);

const ForgotPassword = mongoose.model("ForgotPassword", schema, "forgot-password");
export default ForgotPassword;
