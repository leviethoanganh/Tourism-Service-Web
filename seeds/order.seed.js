// Chạy script: node seeds/order.seed.js
// statusList values:    "initial" (Pending) | "done" (Completed) | "cancel" (Cancelled)
// paymentMethod values: "money" | "bank" | "vnpay" | "zalopay"
// paymentStatus values: "unpaid" | "paid"
require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("../models/order.model");

const connectDB = async () => {
    await mongoose.connect(process.env.DATABASE);
    console.log("Connected to MongoDB");
};

const sampleOrders = [
    {
        code: "28T-001",
        fullName: "Nguyen Van An",
        phone: "0901234567",
        note: "Please arrange window seat",
        items: [
            {
                name: "Da Nang - Hoi An 3D2N",
                avatar: "/client/assets/images/product-1.png",
                quantityAdult: 2,
                quantityChildren: 1,
                quantityBaby: 0,
                priceNewAdult: 2500000,
                priceNewChildren: 1500000,
                priceNewBaby: 0,
                departureDate: new Date("2025-06-15"),
                locationFrom: "hanoi"
            }
        ],
        subTotal: 6500000,
        discount: 500000,
        total: 6000000,
        paymentMethod: "bank",
        paymentStatus: "paid",
        status: "done",
        deleted: false,
        createdAt: new Date("2025-05-01T08:30:00")
    },
    {
        code: "28T-002",
        fullName: "Tran Thi Bich",
        phone: "0912345678",
        note: "",
        items: [
            {
                name: "Ha Long Bay 2D1N Luxury",
                avatar: "/client/assets/images/product-1.png",
                quantityAdult: 2,
                quantityChildren: 0,
                quantityBaby: 0,
                priceNewAdult: 3200000,
                priceNewChildren: 2000000,
                priceNewBaby: 0,
                departureDate: new Date("2025-06-20"),
                locationFrom: "hochiminh"
            }
        ],
        subTotal: 6400000,
        discount: 0,
        total: 6400000,
        paymentMethod: "vnpay",
        paymentStatus: "paid",
        status: "done",
        deleted: false,
        createdAt: new Date("2025-05-03T10:00:00")
    },
    {
        code: "28T-003",
        fullName: "Le Hoang Nam",
        phone: "0923456789",
        note: "Need vegetarian meals",
        items: [
            {
                name: "Phu Quoc Island 4D3N",
                avatar: "/client/assets/images/product-1.png",
                quantityAdult: 1,
                quantityChildren: 0,
                quantityBaby: 0,
                priceNewAdult: 4500000,
                priceNewChildren: 3000000,
                priceNewBaby: 0,
                departureDate: new Date("2025-07-01"),
                locationFrom: "danang"
            }
        ],
        subTotal: 4500000,
        discount: 200000,
        total: 4300000,
        paymentMethod: "money",
        paymentStatus: "unpaid",
        status: "initial",
        deleted: false,
        createdAt: new Date("2025-05-05T14:20:00")
    },
    {
        code: "28T-004",
        fullName: "Pham Thi Lan",
        phone: "0934567890",
        note: "",
        items: [
            {
                name: "Sapa Trekking 3D2N",
                avatar: "/client/assets/images/product-1.png",
                quantityAdult: 3,
                quantityChildren: 2,
                quantityBaby: 1,
                priceNewAdult: 1800000,
                priceNewChildren: 1200000,
                priceNewBaby: 500000,
                departureDate: new Date("2025-07-10"),
                locationFrom: "hanoi"
            }
        ],
        subTotal: 8500000,
        discount: 1000000,
        total: 7500000,
        paymentMethod: "zalopay",
        paymentStatus: "paid",
        status: "initial",
        deleted: false,
        createdAt: new Date("2025-05-07T09:15:00")
    },
    {
        code: "28T-005",
        fullName: "Hoang Minh Tuan",
        phone: "0945678901",
        note: "Honeymoon package, please decorate room",
        items: [
            {
                name: "Nha Trang Beach 5D4N",
                avatar: "/client/assets/images/product-1.png",
                quantityAdult: 2,
                quantityChildren: 0,
                quantityBaby: 0,
                priceNewAdult: 5500000,
                priceNewChildren: 3500000,
                priceNewBaby: 0,
                departureDate: new Date("2025-08-01"),
                locationFrom: "hochiminh"
            }
        ],
        subTotal: 11000000,
        discount: 500000,
        total: 10500000,
        paymentMethod: "bank",
        paymentStatus: "paid",
        status: "done",
        deleted: false,
        createdAt: new Date("2025-05-08T16:00:00")
    },
    {
        code: "28T-006",
        fullName: "Vu Thi Hoa",
        phone: "0956789012",
        note: "",
        items: [
            {
                name: "Hue Imperial City 2D1N",
                avatar: "/client/assets/images/product-1.png",
                quantityAdult: 4,
                quantityChildren: 1,
                quantityBaby: 0,
                priceNewAdult: 1500000,
                priceNewChildren: 900000,
                priceNewBaby: 0,
                departureDate: new Date("2025-06-25"),
                locationFrom: "danang"
            }
        ],
        subTotal: 6900000,
        discount: 0,
        total: 6900000,
        paymentMethod: "money",
        paymentStatus: "unpaid",
        status: "cancel",
        deleted: false,
        createdAt: new Date("2025-05-09T11:30:00")
    },
    {
        code: "28T-007",
        fullName: "Dang Van Duc",
        phone: "0967890123",
        note: "Need airport transfer",
        items: [
            {
                name: "Tokyo - Osaka Japan 7D6N",
                avatar: "/client/assets/images/product-1.png",
                quantityAdult: 2,
                quantityChildren: 0,
                quantityBaby: 0,
                priceNewAdult: 18000000,
                priceNewChildren: 12000000,
                priceNewBaby: 0,
                departureDate: new Date("2025-09-15"),
                locationFrom: "hochiminh"
            }
        ],
        subTotal: 36000000,
        discount: 2000000,
        total: 34000000,
        paymentMethod: "bank",
        paymentStatus: "paid",
        status: "initial",
        deleted: false,
        createdAt: new Date("2025-05-10T08:00:00")
    },
    {
        code: "28T-008",
        fullName: "Nguyen Thi Mai",
        phone: "0978901234",
        note: "Group of friends, same room if possible",
        items: [
            {
                name: "Mui Ne Sand Dunes 2D1N",
                avatar: "/client/assets/images/product-1.png",
                quantityAdult: 5,
                quantityChildren: 0,
                quantityBaby: 0,
                priceNewAdult: 1200000,
                priceNewChildren: 800000,
                priceNewBaby: 0,
                departureDate: new Date("2025-06-28"),
                locationFrom: "hochiminh"
            }
        ],
        subTotal: 6000000,
        discount: 600000,
        total: 5400000,
        paymentMethod: "vnpay",
        paymentStatus: "paid",
        status: "done",
        deleted: false,
        createdAt: new Date("2025-05-11T13:45:00")
    },
    {
        code: "28T-009",
        fullName: "Bui Thanh Long",
        phone: "0989012345",
        note: "",
        items: [
            {
                name: "Singapore - Malaysia 6D5N",
                avatar: "/client/assets/images/product-1.png",
                quantityAdult: 2,
                quantityChildren: 2,
                quantityBaby: 0,
                priceNewAdult: 12000000,
                priceNewChildren: 8000000,
                priceNewBaby: 0,
                departureDate: new Date("2025-10-01"),
                locationFrom: "hanoi"
            }
        ],
        subTotal: 40000000,
        discount: 3000000,
        total: 37000000,
        paymentMethod: "zalopay",
        paymentStatus: "unpaid",
        status: "initial",
        deleted: false,
        createdAt: new Date("2025-05-12T15:20:00")
    },
    {
        code: "28T-010",
        fullName: "Do Thi Thu",
        phone: "0990123456",
        note: "Birthday trip, please arrange cake",
        items: [
            {
                name: "Da Lat Flower Valley 3D2N",
                avatar: "/client/assets/images/product-1.png",
                quantityAdult: 2,
                quantityChildren: 1,
                quantityBaby: 0,
                priceNewAdult: 2200000,
                priceNewChildren: 1400000,
                priceNewBaby: 0,
                departureDate: new Date("2025-07-20"),
                locationFrom: "hochiminh"
            }
        ],
        subTotal: 5800000,
        discount: 300000,
        total: 5500000,
        paymentMethod: "money",
        paymentStatus: "unpaid",
        status: "cancel",
        deleted: false,
        createdAt: new Date("2025-05-13T10:10:00")
    }
];

const seed = async () => {
    try {
        await connectDB();

        // Xóa các order seed cũ (nếu chạy lại)
        await Order.deleteMany({ code: /^28T-0/ });
        console.log("Cleared old seed orders");

        await Order.insertMany(sampleOrders);
        console.log("Inserted 10 sample orders successfully");

        await mongoose.disconnect();
        console.log("Done.");
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
};

seed();
