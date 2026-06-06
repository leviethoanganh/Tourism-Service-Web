const User = require("../../models/user.model");
const moment = require("moment");

// [GET] /admin/user/list
module.exports.list = async (req, res) => {
    try {
        // 1. Khởi tạo điều kiện tìm kiếm mặc định
        const find = { deleted: false };

        // 2. Lọc theo trạng thái (active / inactive / initial)
        if (req.query.status) {
            find.status = req.query.status;
        }

        // 3. Lọc theo khoảng thời gian đăng ký
        const filterDate = {};
        if (req.query.startDate) {
            filterDate.$gte = moment(req.query.startDate).startOf("day").toDate();
        }
        if (req.query.endDate) {
            filterDate.$lte = moment(req.query.endDate).endOf("day").toDate();
        }
        if (Object.keys(filterDate).length > 0) {
            find.createdAt = filterDate;
        }

        // 4. Tìm kiếm theo từ khóa trên fullName, email, phone
        if (req.query.keyword) {
            const regex = new RegExp(req.query.keyword.trim(), "i");
            find.$or = [
                { fullName: regex },
                { email: regex },
                { phone: regex }
            ];
        }

        // 5. Phân trang
        const limitItems = 6;
        const page = parseInt(req.query.page) || 1;
        const totalRecord = await User.countDocuments(find);
        const totalPage = Math.ceil(totalRecord / limitItems);
        const skip = (page - 1) * limitItems;

        const pagination = {
            currentPage: page,
            totalPage: totalPage,
            totalRecord: totalRecord,
            limitItems: limitItems,
            skip: skip
        };

        // 6. Lấy danh sách user theo điều kiện lọc, có phân trang
        const userList = await User.find(find)
            .sort({ createdAt: "desc" })
            .limit(limitItems)
            .skip(skip);

        // 7. Format ngày tạo tài khoản
        for (const item of userList) {
            item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
        }

        // 8. Render giao diện
        res.render("admin/pages/user-list", {
            pageTitle: "User Management",
            userList: userList,
            query: req.query,
            pagination: pagination
        });

    } catch (error) {
        console.error("Error fetching user list:", error);
        res.redirect("back");
    }
};
