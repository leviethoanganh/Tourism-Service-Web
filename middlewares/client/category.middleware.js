const { buildCategoryTree } = require("../../helpers/category.helper");
const Category = require("../../models/category.model");

module.exports.list = async (req, res, next) => {
    // 1. Lấy danh sách danh mục đang hoạt động và chưa bị xóa
    const categoryList = await Category.find({
        deleted: false,
        status: "active"
    });

    // 2. Chuyển đổi danh sách phẳng thành cấu trúc cây (đa cấp)
    const categoryTree = buildCategoryTree(categoryList);

    // 3. Đưa vào res.locals để tất cả các file Pug (như Header/Menu) đều dùng được
    res.locals.categoryList = categoryTree;

    // 4. Cho phép request đi tiếp
    next();
};