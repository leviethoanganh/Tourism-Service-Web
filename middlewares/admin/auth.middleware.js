const jwt = require('jsonwebtoken');
const AccountAdmin = require('../../models/account.admin.model');
const Role = require('../../models/role.model');

module.exports.verifyToken = async (req, res, next) => {
    try {
        // 1. Lấy token từ cookie
        const token = req.cookies.token;

        // Nếu không có token -> Người dùng chưa đăng nhập
        if (!token) {
            return res.redirect(`/${global.pathAdmin}/auth/login`); 
        }

        // 2. Giải mã và xác thực Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Truy vấn database để kiểm tra người dùng
        const existAccount = await AccountAdmin.findOne({
            _id: decoded.id,
            email: decoded.email,
            status: "active",
            deleted: false 
        }).select("-password"); // Bảo mật: Không lấy mật khẩu ra

        if (!existAccount) {
            console.log("LỖI: Token hợp lệ nhưng không tìm thấy User trong DB");
            res.clearCookie("token");
            return res.redirect(`/${global.pathAdmin}/auth/login`);
        }

        // 4. Lấy thông tin quyền (Role)
        if (existAccount.role) {
            const role = await Role.findOne({
                _id: existAccount.role,
                deleted: false
            });
            if (role) {
                // Sử dụng .toObject() hoặc gán trực tiếp nếu Mongoose cho phép
                existAccount.roleName = role.title || role.name; 
                res.locals.pers = role.permissions;
                req.pers = role.permissions;
            }
        }

        // 5. Lưu thông tin để dùng ở các middleware/controller sau và giao diện PUG
        res.locals.account = existAccount;
        req.account = existAccount;

        next();

    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.clearCookie("token");
        res.redirect(`/${global.pathAdmin}/auth/login`);
    }
};

