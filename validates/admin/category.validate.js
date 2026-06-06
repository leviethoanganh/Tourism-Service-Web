const Joi = require('joi');

module.exports.createPost = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .messages({
                "string.empty": "Please enter the category name!",
                "any.required": "Category name is required!"
        }),
        parent: Joi.string().allow(''),
        position: Joi.alternatives().try(Joi.number(), Joi.string().allow('')).optional(), // Nếu position là số, nên dùng Joi.number()
        status: Joi.string().allow(''),
        avatar: Joi.string().allow(''),
        description: Joi.string().allow(''),
    }).unknown(true);

    // Thực hiện validate dữ liệu từ body
    const { error } = schema.validate(req.body);

    if (error) {
        const errorMessage = error.details[0].message;
        return res.json({
            code: "error",
            message: errorMessage
        });
    }

    // Nếu không có lỗi, chuyển sang middleware hoặc controller tiếp theo
    next();
};

module.exports.changeMultiPatch = async (req, res, next) => {
    // 1. Định nghĩa cấu trúc validate
    const schema = Joi.object({
        listId: Joi.array()
            .min(1) // Đảm bảo mảng có ít nhất 1 phần tử
            .required()
            .messages({
                "array.min": "Please select at least 1 record!",
                "any.required": "Please select at least 1 record!"
            }),
        option: Joi.string()
            .required()
            .messages({
                "string.empty": "Please select an action to apply!",
                "any.required": "Please select an action to apply!"
            }),
    });

    // 2. Thực hiện validate dữ liệu từ req.body
    const { error } = schema.validate(req.body);

    // 3. Xử lý kết quả trả về
    if (error) {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage
        });
        return; // Dừng lại nếu có lỗi
    }

    // Nếu dữ liệu hợp lệ, chuyển sang controller tiếp theo
    next();
};

