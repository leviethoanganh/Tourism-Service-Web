import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DATABASE as string);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
