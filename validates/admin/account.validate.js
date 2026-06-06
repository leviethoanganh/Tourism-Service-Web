const Joi = require('joi');

module.exports.registerPost = async (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string()
        .min(5)
        .max(50)
        .required()
        .messages({
            "string.empty": "Please enter your full name!",
            "string.min": "Please enter at least 5 characters!",
            "string.max": "Please enter at most 50 characters!",
        }),
        email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Please enter your email!",
            "string.email": "Invalid email format!",
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
            "string.empty": "Please enter your password!",
            "string.min": "Password must be at least 8 characters!",
            "password.lowercase": "Password must contain a lowercase letter!",
            "password.uppercase": "Password must contain an uppercase letter!",
            "password.number": "Password must contain a number!",
            "password.special": "Password must contain a special character!",
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
                "string.empty": "Please enter your email!",
                "string.email": "Invalid email format!",
                "any.required": "Email is required!"
            }),
        password: Joi
            .string()
            .required()
            .messages({
                "string.empty": "Please enter your password!",
                "any.required": "Password is required!"
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
            "string.empty": "Please enter your email!",
            "string.email": "Invalid email format!",
            "any.required": "Email is required!"
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
            "string.empty": "Please include your email!",
            "string.email": "Invalid email format!",
            "any.required": "Email is required!"
        }),
        otp: Joi.string()
        .required()
        .messages({
            "string.empty": "Please enter the OTP code!",
            "any.required": "OTP code is required!"
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
            "string.empty": "Please enter your password!",
            "string.min": "Password must be at least 8 characters!",
            "password.lowercase": "Password must contain at least one lowercase letter!",
            "password.uppercase": "Password must contain at least one uppercase letter!",
            "password.number": "Password must contain at least one number!",
            "password.special": "Password must contain at least one special character!",
            "any.required": "Password is required!"
        }),
        // Bạn nên thêm confirmPassword vào đây nếu form của bạn có trường xác nhận lại mật khẩu
        confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .messages({
            "any.only": "Passwords do not match!"
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

