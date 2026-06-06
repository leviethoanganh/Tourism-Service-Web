// Chạy script: node seeds/user.seed.js
// status values: "active" | "inactive" | "initial" (Pending)
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.model");

const connectDB = async () => {
    await mongoose.connect(process.env.DATABASE);
    console.log("Connected to MongoDB");
};

const sampleUsers = [
    {
        fullName: "Nguyen Van An",
        email: "nguyenvanan@gmail.com",
        phone: "0901234567",
        address: "123 Le Loi, District 1, Ho Chi Minh City",
        avatar: "",
        status: "active",
        deleted: false,
        createdAt: new Date("2025-04-01T08:00:00")
    },
    {
        fullName: "Tran Thi Bich",
        email: "trантhibich@gmail.com",
        phone: "0912345678",
        address: "45 Tran Hung Dao, Hoan Kiem, Hanoi",
        avatar: "",
        status: "active",
        deleted: false,
        createdAt: new Date("2025-04-05T09:30:00")
    },
    {
        fullName: "Le Hoang Nam",
        email: "lehoangnam@gmail.com",
        phone: "0923456789",
        address: "78 Nguyen Van Linh, Hai Chau, Da Nang",
        avatar: "",
        status: "inactive",
        deleted: false,
        createdAt: new Date("2025-04-10T14:00:00")
    },
    {
        fullName: "Pham Thi Lan",
        email: "phamthilan@gmail.com",
        phone: "0934567890",
        address: "22 Tran Phu, Nha Trang, Khanh Hoa",
        avatar: "",
        status: "initial",
        deleted: false,
        createdAt: new Date("2025-04-12T10:15:00")
    },
    {
        fullName: "Hoang Minh Tuan",
        email: "hoangminhtuan@gmail.com",
        phone: "0945678901",
        address: "56 Hung Vuong, Hue City",
        avatar: "",
        status: "active",
        deleted: false,
        createdAt: new Date("2025-04-15T11:00:00")
    },
    {
        fullName: "Vu Thi Hoa",
        email: "vuthihoa@gmail.com",
        phone: "0956789012",
        address: "89 Pham Ngu Lao, District 1, Ho Chi Minh City",
        avatar: "",
        status: "active",
        deleted: false,
        createdAt: new Date("2025-04-18T16:30:00")
    },
    {
        fullName: "Dang Van Duc",
        email: "dangvanduc@gmail.com",
        phone: "0967890123",
        address: "12 Ly Thai To, Hoan Kiem, Hanoi",
        avatar: "",
        status: "inactive",
        deleted: false,
        createdAt: new Date("2025-04-20T08:45:00")
    },
    {
        fullName: "Nguyen Thi Mai",
        email: "nguyenthimai@gmail.com",
        phone: "0978901234",
        address: "34 Bach Dang, Son Tra, Da Nang",
        avatar: "",
        status: "initial",
        deleted: false,
        createdAt: new Date("2025-04-22T13:20:00")
    },
    {
        fullName: "Bui Thanh Long",
        email: "buithanhlong@gmail.com",
        phone: "0989012345",
        address: "67 Vo Thi Sau, District 3, Ho Chi Minh City",
        avatar: "",
        status: "active",
        deleted: false,
        createdAt: new Date("2025-04-25T09:00:00")
    },
    {
        fullName: "Do Thi Thu",
        email: "dothithu@gmail.com",
        phone: "0990123456",
        address: "100 Tran Quang Khai, Hoan Kiem, Hanoi",
        avatar: "",
        status: "active",
        deleted: false,
        createdAt: new Date("2025-04-28T15:10:00")
    }
];

const seed = async () => {
    try {
        await connectDB();

        // Xóa user seed cũ (nếu chạy lại)
        await User.deleteMany({ email: /@gmail\.com$/ });
        console.log("Cleared old seed users");

        await User.insertMany(sampleUsers);
        console.log("Inserted 10 sample users successfully");

        await mongoose.disconnect();
        console.log("Done.");
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
};

seed();
