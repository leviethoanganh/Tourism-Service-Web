const Joi = require('joi');

module.exports.registerPost = async (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string()
        .min(5)
        .max(50)
        .required()
        .messages({
            "string.empty": "Vui lòng nhập họ tên!",
            "string.min": "Vui lòng nhập ít nhất 5 ký tự!",
            "string.max": "Vui lòng nhập tối đa 50 ký tự!",
        }),
        email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
        }),
        password: Joi.string()
        .min(8)
        .custom((value, helpers) => {
            if (!/[a-z]/.test(value)) return helpers.error('password.lowercase');
            if (!/[A-Z]/.test(value)) return helpers.error('password.uppercase');
            if (!/\d/.test(value)) return helpers.error('password.number');
            if (!/[^A-Za-z0-9]/.test(value)) return helpers.error('password.special');
            return value;
        })
        .required()
        .messages({
            "string.empty": "Vui lòng nhập mật khẩu!",
            "string.min": "Mật khẩu phải có ít nhất 8 ký tự!",
            "password.lowercase": "Mật khẩu phải chứa ký tự thường!",
            "password.uppercase": "Mật khẩu phải chứa ký tự hoa!",
            "password.number": "Mật khẩu phải chứa chữ số!",
            "password.special": "Mật khẩu phải chứa ký tự đặc biệt!",
        }),
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        const errorMessage = error.details[0].message;
        return res.json({ // Added return here to prevent calling next() on error
            code: "error",
            message: errorMessage
        });
    }
    
    next();
};


module.exports.validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi
            .string()
            .email()
            .required()
            .messages({
                "string.empty": "Vui lòng nhập email!",
                "string.email": "Email không đúng định dạng!",
                "any.required": "Email là bắt buộc!"
            }),
        password: Joi
            .string()
            .required()
            .messages({
                "string.empty": "Vui lòng nhập mật khẩu!",
                "any.required": "Mật khẩu là bắt buộc!"
            }),
        rememberPassword :  Joi . boolean ()
    });

    const { error } = schema.validate(req.body, { abortEarly: false }); 
    // abortEarly: false giúp lấy tất cả lỗi cùng lúc nếu cần

    if (error) {
        return res.status(400).json({ // Nên dùng status 400 cho lỗi phía Client
        code: "error",
        message: error.details[0].message
        });
    }

    next();
};



module.exports.forgotPasswordPost = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
            "any.required": "Email là bắt buộc!"
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const errorMessage = error.details[0].message;
        return res.json({
        code: "error",
        message: errorMessage
        });
    }

    next();
};


module.exports.otpPasswordPost = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Vui lòng gửi kèm email!",
            "string.email": "Email không đúng định dạng!",
            "any.required": "Email là bắt buộc!"
        }),
        otp: Joi.string()
        .required()
        .messages({
            "string.empty": "Vui lòng nhập mã OTP!",
            "any.required": "Mã OTP là bắt buộc!"
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const errorMessage = error.details[0].message;
        return res.json({
        code: "error",
        message: errorMessage
        });
    }

    next();
};


module.exports.resetPasswordPost = async (req, res, next) => {
    const schema = Joi.object({
        password: Joi.string()
        .min(8)
        .custom((value, helpers) => {
            if (!/[a-z]/.test(value)) {
            return helpers.error('password.lowercase');
            }
            if (!/[A-Z]/.test(value)) {
            return helpers.error('password.uppercase');
            }
            if (!/\d/.test(value)) {
            return helpers.error('password.number');
            }
            if (!/[^A-Za-z0-9]/.test(value)) {
            return helpers.error('password.special');
            }
            return value;
        })
        .required()
        .messages({
            "string.empty": "Vui lòng nhập mật khẩu!",
            "string.min": "Mật khẩu phải có ít nhất 8 ký tự!",
            "password.lowercase": "Mật khẩu phải chứa ít nhất một ký tự thường!",
            "password.uppercase": "Mật khẩu phải chứa ít nhất một ký tự hoa!",
            "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
            "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
            "any.required": "Mật khẩu là bắt buộc!"
        }),
        // Bạn nên thêm confirmPassword vào đây nếu form của bạn có trường xác nhận lại mật khẩu
        confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .messages({
            "any.only": "Xác nhận mật khẩu không khớp!"
        })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const errorMessage = error.details[0].message;
        return res.json({
        code: "error",
        message: errorMessage
        });
    }

    next();
};

