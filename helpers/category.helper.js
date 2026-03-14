const Category = require("../models/category.model");

const buildCategoryTree = (categories, parentId = "") => {
    const tree = [];

    for (const item of categories) {
        // Sử dụng ép kiểu String hoặc so sánh tương đối nếu parentId có thể là số hoặc chuỗi
        if (item.parent === parentId) {
            const children = buildCategoryTree(categories, item.id);
            
            const node = {
                id :  item.id,
                name :  item.name,
                slug :  item.slug,
                children :  children
            };

            // Chỉ thêm thuộc tính children nếu nó có dữ liệu (giúp tree gọn hơn)
            if (children.length > 0) {
                node.children = children;
            }

            tree.push(node);
        }
    }

    return tree;
};

module.exports = { buildCategoryTree };

const getCategorySubId = async (parentId = "") => {
    let listId = []; // Sử dụng let để có thể gán lại hoặc thao tác mảng

    const children = await Category.find({
        parent: parentId,
        deleted: false,
        status: "active"
    });

    for (const item of children) {
        listId.push(item.id); // Thêm ID trực tiếp của danh mục con
        
        // Đệ quy để lấy ID của các danh mục cháu, chắt...
        const subChildrenIds = await getCategorySubId(item.id);
        listId = listId.concat(subChildrenIds); // Gộp mảng kết quả vào listId hiện tại
    }

    return listId;
};

module.exports.getCategorySubId = getCategorySubId;