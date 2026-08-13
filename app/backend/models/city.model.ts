import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  { name: String },
  { timestamps: true }
);

const City = mongoose.model("City", citySchema, "cities");
export default City;
