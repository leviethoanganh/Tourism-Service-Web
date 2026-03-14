const AccountAdmin = require("../../models/account.admin.model");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

module.exports.edit = (req, res) => {
    res.render('admin/pages/profile-edit', {
        pageTitle: "Thông tin cá nhân"
    });
};

module.exports.editPatch = async (req, res) => {
    const id = req.account.id;
    const existEmail = await AccountAdmin.findOne({
        _id: { $ne: id }, // không tìm chính nó
        email: req.body.email
    });

    if (existEmail) {
        res.json({
            code: "error",
            message: "Email đã tồn tại trong hệ thống!"
        });
        return;
    }

    if (req.file) {
            // Nếu dùng Memory Storage, file nằm trong req.file.buffer
            // Chuyển sang base64 để lưu vào MongoDB (nếu avatar là String)
            const mimetype = req.file.mimetype;
            const base64 = req.file.buffer.toString("base64");
            req.body.avatar = `data:${mimetype};base64,${base64}`;
        } else {
            req.body.avatar = "";
    }

    req.body.updatedBy = req.account.id;

    await AccountAdmin.updateOne({
        _id: id,
        deleted: false
    }, req.body);

    console.log("Đã cập nhật thông tin tài khoản quản trị:", req.body);
    // Tạo JWT
    const token = jwt.sign(
        {
            id: id,
            email: req.body.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    // Lưu token vào cookie
    res.cookie("token", token, {
        maxAge: (24 * 60 * 60 * 1000), // 1 ngày
        httpOnly: true, // Chỉ cho phép cookie được truy cập bởi server
        sameSite: "strict", // Không cho phép lấy được cookie từ tên miền khác
    });

    res.json({
        code: "success",
        message: "Đã cập nhật tài khoản quản trị!"
    });
};

module.exports.changePassword = (req, res) => {
    res.render('admin/pages/profile-change-password', {
        pageTitle: "Đổi mật khẩu"
    });
};

module.exports.changePasswordPatch = async (req, res) => {
    const id = req.account.id;

    // Mã hóa mật khẩu mới
    req.body.password = await bcrypt.hash(req.body.password, 10);
    req.body.updatedBy = req.account.id;

    await AccountAdmin.updateOne({
        _id: id,
        deleted: false
    }, req.body);

    res.json({
        code: "success",
        message: "Đã đổi mật khẩu thành công!"
    });
};

