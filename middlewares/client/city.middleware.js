const City = require("../../models/city.model");

module.exports.list = async (req, res, next) => {
    // 1. Lấy tất cả danh sách thành phố từ Database
    const cityList = await City.find({
        deleted: false, // Thường nên thêm điều kiện này nếu có xóa mềm
        status: "active" // Chỉ lấy các thành phố đang hoạt động
    });

    // 2. Gán vào res.locals để tất cả file Pug có thể truy cập được dữ liệu này
    res.locals.cityList = cityList;

    // 3. Chuyển sang middleware hoặc controller tiếp theo
    next();
};