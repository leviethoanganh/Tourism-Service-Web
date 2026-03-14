const Joi = require('joi');

module.exports.createPost = (req, res, next) => {
    // 1. Định nghĩa cấu trúc Schema để kiểm tra req.body
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .messages({
                "string.empty": "Vui lòng nhập tên tour!",
                "any.required": "Vui lòng nhập tên tour!"
            }),
        // Cho phép các trường dưới đây là chuỗi rỗng nếu người dùng không nhập
        category: Joi.string().allow(''),
        position: Joi.string().allow(''),
        status: Joi.string().allow(''),
        avatar: Joi.string().allow(''),
        priceAdult: Joi.string().allow(''),
        priceChildren: Joi.string().allow(''),
        priceBaby: Joi.string().allow(''),
        priceNewAdult: Joi.string().allow(''),
        priceNewChildren: Joi.string().allow(''),
        priceNewBaby: Joi.string().allow(''),
        stockAdult: Joi.string().allow(''),
        stockChildren: Joi.string().allow(''),
        stockBaby: Joi.string().allow(''),
        locations: Joi.string().allow(''),
        time: Joi.string().allow(''),
        vehicle: Joi.string().allow(''),
        departureDate: Joi.string().allow(''),
        information: Joi.string().allow(''),
        schedules: Joi.string().allow(''),
        images: Joi.string().allow(''),
    });

    // 2. Thực hiện kiểm tra dữ liệu
    const { error } = schema.validate(req.body);

    // 3. Xử lý nếu có lỗi
    if (error) {
        const errorMessage = error.details[0].message;
        return res.json({
            code: "error",
            message: errorMessage
        });
    }

    // Nếu dữ liệu hợp lệ, chuyển sang Controller để lưu vào Database
    next();
};