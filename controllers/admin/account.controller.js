const AccountAdmin = require('../../models/account.admin.model');
const bcrypt = require ( "bcryptjs" );
const jwt = require('jsonwebtoken');
const { generateRandomNumber } = require("../../helpers/generate.helper");
const ForgotPassword = require("../../models/forgot-password.model");
const { sendMail } = require("../../helpers/mail.helper");

module.exports.login = (req, res) => {
    res.render('admin/pages/login', {
        pageTitle: "Login Admin"
    });
}

module.exports.loginPost = async (req, res) => {
    const { email, password, rememberPassword } = req.body;
    // Kiểm tra email
    const existAccount = await AccountAdmin.findOne({
        email: email
    });

    if (!existAccount) {
        res.json({
            code: "error",
            message: "Email không tồn tại trong hệ thống!"
        });
        return;
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, existAccount.password);
    if (!isPasswordValid) {
            res.json({
            code: "error",
            message: "Mật khẩu không đúng!"
        });
        return;
    }

    // Kiểm tra trạng thái
    if (existAccount.status != "active") {
            res.json({
            code: "error",
            message: "Tài khoản chưa được kích hoạt!"
        });
        return;
    }

    // Tạo Token JWT
    const token = jwt.sign(
        {
            id: existAccount.id,
            email: existAccount.email,
        },
            process.env.JWT_SECRET, // Đảm bảo bạn đã định nghĩa JWT_SECRET trong file .env
        {
            expiresIn: rememberPassword ? "7d" : "1d",
        }
    );

    // Lưu token vào cookie
    res.cookie("token", token, {
        maxAge: rememberPassword ? ( 7 * 24 * 60 * 60 * 1000 ) : ( 24 * 60 * 60 * 1000 ),
        httpOnly: true, // Bảo mật: Chỉ server mới đọc được cookie này
        secure: false, // process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS nếu là production
        sameSite: "strict", // Chống tấn công CSRF
    });

    // Phản hồi thành công
    res.json({
        code: "success",
        message: "Đăng nhập thành công!"
    });
};

module.exports.register = (req, res) => {
    res.render('admin/pages/register', {
        pageTitle: "Register Admin"
    });
}

module.exports.registerPost = async (req, res) => {

    const existAccount = await AccountAdmin.findOne({
        email: req.body.email
    });

    if(existAccount){
        res.json({
            code: "error",
            message: "Email đã tồn tại trong hệ thống!"
        });
        return ;
    }

    req.body.status = "initial";
    req.body.deleted = false;
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const newAccount = new AccountAdmin(req.body);
    await newAccount.save();

    res.json({
        code: "success",
        message: "Đăng ký thành công!"
    })

}

module.exports.registerInitial = (req, res) => {
    res.render('admin/pages/register-initial', {
        pageTitle: "Register Admin"
    });
}

module.exports.forgotPassword = (req, res) => {
    res.render('admin/pages/forgot-password', {
        pageTitle: "Forgot Password"
    });
}



module.exports.forgotPasswordPost = async (req, res) => {
    try {
        // 1. Sửa lỗi: req.body chứ không phải req.bodysuit
        const { email } = req.body;

        // 2. Kiểm tra tài khoản tồn tại và đang hoạt động
        const existAccount = await AccountAdmin.findOne({
            email: email,
            status: "active"
        });

        if (!existAccount) {
            return res.json({
                code: "error",
                message: "Email không tồn tại trong hệ thống hoặc tài khoản bị khóa!"
            });
        }

        // 3. Kiểm tra xem đã gửi OTP trước đó chưa (tránh spam)
        const existEmailInForgotPassword = await ForgotPassword.findOne({ email: email });

        if (existEmailInForgotPassword) {
            return res.json({
                code: "error",
                message: "Vui lòng đợi 5 phút trước khi yêu cầu mã mới!"
            });
        }

        // 4. Tạo mã OTP (ví dụ 4 số)
        const otp = generateRandomNumber(4);

        // 5. Lưu vào CSDL
        // Lưu ý: Để tự động xóa sau 5 phút, bạn cần set TTL Index trong Schema của MongoDB
        const record = new ForgotPassword({
            email: email,
            otp: otp,
            expireAt: new Date(Date.now() + 5 * 60 * 1000) 
        });

        await record.save();

        // 6. Gửi mã OTP qua email
        const subject = "Mã OTP lấy lại mật khẩu";
        const content = `Mã OTP của bạn là: <b>${otp}</b>. Mã có hiệu lực trong 5 phút. Vui lòng không cung cấp mã này cho bất kỳ ai.`;
        
        // Đảm bảo hàm sendMail đã được cấu hình đúng
    //    sendMail(email, subject, content);

        res.json({
            code: "success",
            message: "Mã OTP đã được gửi qua email của bạn!"
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.json({
        code: "error",
        message: "Đã có lỗi xảy ra, vui lòng thử lại!"
        });
    }
};

module.exports.otpPassword = (req, res) => {
    res.render('admin/pages/otp-password', {
        pageTitle: "OTP Password"
    });
}

module.exports.otpPasswordPost = async (req, res) => {
    try {
        // 1. Lấy dữ liệu từ body (Sửa lỗi bodysuit thành body)
        const { email, otp } = req.body;

        // 2. Kiểm tra xem email có tồn tại và đang hoạt động không
        const existAccount = await AccountAdmin.findOne({
            email: email,
            status: "active"
        });

        if (!existAccount) {
            return res.json({
                code: "error",
                message: "Email không tồn tại trong hệ thống!"
            });
        }

        // 3. Kiểm tra mã OTP trong bảng ForgotPassword
        const existRecordInForgotPassword = await ForgotPassword.findOne({
            email: email,
            otp: otp
        });

        if (!existRecordInForgotPassword) {
            return res.json({
                code: "error",
                message: "Mã OTP không hợp lệ hoặc đã hết hạn!"
            });
        }

        // 4. Tạo JWT để định danh người dùng cho bước đổi mật khẩu tiếp theo
        const token = jwt.sign(
            {
                id: existAccount.id,
                email: existAccount.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // 5. Lưu token vào cookie
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 ngày
            httpOnly: true, // Bảo mật: Chỉ server mới đọc được cookie
            secure: false, // Để true nếu dùng HTTPS
            sameSite: "strict",
        });

        // 6. Trả về thông báo thành công
        res.json({
            code: "success",
            message: "Xác nhận mã OTP thành công!"
        });

    } catch (error) {
            console.error("OTP Error:", error);
            res.json({
            code: "error",
            message: "Đã có lỗi xảy ra, vui lòng thử lại!"
        });
    }
};

module.exports.resetPassword = (req, res) => {
    res.render('admin/pages/reset-password', {
        pageTitle: "Reset Password"
    });
}

module.exports.resetPasswordPost = async (req, res) => {
    try {
        // 1. Lấy mật khẩu mới từ body (Sửa lỗi bodysuit thành body)
        const { password } = req.body;

        // 2. Mã hóa mật khẩu
        const passwordHash = await bcrypt.hash(password, 10);

        // 3. Cập nhật vào Database
        // Sử dụng ID từ req.account (do authMiddleware.verifyToken cung cấp)
        await AccountAdmin.updateOne(
        {
            _id: req.account.id
        },
        {
            password: passwordHash
        }
        );

        // 4. Trả về phản hồi thành công
        res.json({
            code: "success",
            message: "Đã đổi mật khẩu thành công!"
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.json({
            code: "error",
            message: "Đã có lỗi xảy ra, vui lòng thử lại!"
        });
    }
};

// [GET] /admin/accounts/logout
module.exports.logout = (req, res) => {
  // Xóa cookie chứa token
    res.clearCookie("token");
    
    // Chuyển hướng về trang login
    res.redirect(`/${global.pathAdmin}/account/login`);
};

