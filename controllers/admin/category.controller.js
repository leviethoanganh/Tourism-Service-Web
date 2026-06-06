const Category = require("../../models/category.model");
const  {  buildCategoryTree  }  =  require ("../../helpers/category.helper");
const AccountAdmin = require("../../models/account.admin.model");
const moment = require("moment");
const slugify = require("slugify");

module.exports.list = async (req, res) => {
    // 1. Khởi tạo đối tượng tìm kiếm mặc định
    const find = {
        deleted: false
    };

    // 2. Bộ lọc Trạng thái và Người tạo
    if (req.query.status) {
        find.status = req.query.status;
    }

    if (req.query.createdBy) {
        find.createdBy = req.query.createdBy;
    }

    // Lọc theo khoảng thời gian tạo (createdAt)
    const filterDate = {};
    if (req.query.startDate) {
        filterDate.$gte = moment(req.query.startDate).toDate();
        find.createdAt = filterDate;
    }
    if (req.query.endDate) {
        filterDate.$lte = moment(req.query.endDate).toDate();
        find.createdAt = filterDate;
    }

    // Bộ lọc Tìm kiếm theo từ khóa (slug)
    if (req.query.keyword) {
        let keyword = req.query.keyword.trim();
        keyword = keyword.replace(/\s\s+/g, " ");
        const keywordSlug = slugify(keyword, {
            lower: true,
            locale: 'vi'
        });
        const regex = new RegExp(keywordSlug, "i");
        find.slug = regex;
    }

    // 3. Xử lý Phân trang (Pagination)
    const limitItems = 3;
    let page = 1;
    if (req.query.page) {
        page = parseInt(req.query.page);
    }

    const totalRecord = await Category.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    const skip = (page - 1) * limitItems;

    const pagination = {
        currentPage: page,
        totalPage: totalPage,
        totalRecord: totalRecord,
        limitItems: limitItems,
        skip: skip
    };

    // 4. Lấy danh sách danh mục (kèm sort, limit, skip)
    const categoryList = await Category.find(find)
        .sort({ position: "desc" })
        .limit(limitItems)
        .skip(skip);

    // 5. Duyệt qua từng danh mục để format dữ liệu
    for (const item of categoryList) {
        // Xử lý thông tin người tạo
        if (item.createdBy) {
            const infoAccount = await AccountAdmin.findOne({ _id: item.createdBy });
            if (infoAccount) {
                item.createdByFullName = infoAccount.fullName;
            }
        }
        
        if (item.createdAt) {
            item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
        }

        // Xử lý thông tin người cập nhật
        if (item.updatedBy) {
            const infoAccount = await AccountAdmin.findOne({ _id: item.updatedBy });
            if (infoAccount) {
                item.updatedByFullName = infoAccount.fullName;
            }
        }

        if (item.updatedAt) {
            item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
        }
    }

    // Lấy danh sách admin cho bộ lọc filter
    const accountAdminList = await AccountAdmin
        .find({ deleted: false })
        .select("id fullName");

    // 6. Render giao diện
    res.render('admin/pages/category-list', {
        pageTitle: "Category Management",
        categoryList: categoryList,
        accountAdminList: accountAdminList,
        pagination: pagination // Gửi object pagination sang file .pug
    });
};
module.exports.create = async (req, res) => {
    // 1. Lấy dữ liệu phẳng từ Database
    const categoryList = await Category.find({
        deleted: false
    });

    // 2. Chuyển danh sách phẳng thành cấu trúc cây (dùng hàm buildCategoryTree bạn viết trước đó)
    const categoryTree = buildCategoryTree(categoryList);

    // 3. Gửi dữ liệu cây qua file Pug để hiển thị
    res.render('admin/pages/category-create', {
        pageTitle: "Create Category",
        categoryList: categoryTree
    });
};


// [POST] /admin/categories/create
module.exports.createPost = async (req, res) => {
    try {
        // 1. Handle Avatar (assuming you use middleware like Multer)
        if (!req.pers.includes("category-create")) {
            res.json({
                code: "error",
                message: "Access denied!"
            });
            return;
        }

        if (req.file) {
            req.body.avatar = req.file.path;
        } else {
            req.body.avatar = "";
        }


        // 2. Handle Position Logic
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            // Find the category with the highest position
            const count = await Category.countDocuments();
            if (count > 0) {
                const lastRecord = await Category.findOne().sort({ position: "desc" });
                req.body.position = lastRecord.position + 1;
            } else {
                req.body.position = 1;
            }
        }

        // 3. Audit Info
        // req.account is usually populated by an authentication middleware
        req.body.createdBy = req.account ? req.account.id : "system";

        // 4. Save Record
        const dataSave = { ...req.body };
        console.log(req.body);

        const newRecord = new Category(dataSave);
        await newRecord.save();

        res.json({
            code: "success",
            message: "Category created successfully!"
        });
    } catch (error) {
        res.json({
        code: "error",
        message: "An error occurred!",
        error: error.message
        });
    }
};


module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Lấy thông tin chi tiết của danh mục hiện tại
        const categoryDetail = await Category.findOne({
            _id: id,
            deleted: false
        });

        // Nếu không tìm thấy hoặc đã bị xóa, quay về trang danh sách
        if (!categoryDetail) {
            res.redirect(`/${pathAdmin}/category/list`);
            return;
        }

        // 2. Lấy toàn bộ danh sách để xây dựng cây danh mục (cho phần chọn Danh mục cha)
        const categoryList = await Category.find({
            deleted: false
        });

        const categoryTree = buildCategoryTree(categoryList);

        // 3. Render giao diện chỉnh sửa
        res.render('admin/pages/category-edit', {
            pageTitle: "Edit Category",
            categoryList: categoryTree,
            categoryDetail: categoryDetail
        });
    } catch (error) {
        console.error("Lỗi trang Edit:", error);
        res.redirect(`/${pathAdmin}/category/list`);
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        if (!req.pers.includes("category-edit")) {
            res.json({
                code: "error",
                message: "Access denied!"
            });
            return;
        }
        const id = req.params.id;

        // 1. Kiểm tra danh mục có tồn tại không
        const categoryDetail = await Category.findOne({
            _id: id,
            deleted: false
        });

        if (!categoryDetail) {
            return res.json({
                code: "error",
                message: "Category not found!"
            });
        }

        // 2. Xử lý dữ liệu (Clean null prototype)
        const data = { ...req.body };

        // 3. Xử lý Avatar
        if (req.file) {
            data.avatar = req.file.path;
        }

        // 4. Xử lý Position
        if (data.position) {
            data.position = parseInt(data.position);
        } else {
            const record = await Category.findOne({ 
                deleted: false 
            }).sort({ position: "desc" });

            if (record) {
                data.position = record.position + 1;
            } else {
                data.position = 1;
            }
        }

        // 5. Thông tin người cập nhật
        data.updatedBy = (req.account && req.account.id) ? req.account.id : "system";

        // 6. Cập nhật vào Database
        await Category.updateOne(
            { _id: id, deleted: false },
            data
        );

        res.json({
            code: "success",
            message: "Category updated successfully!"
        });

    } catch (error) {
        console.error("Lỗi EditPatch:", error);
        res.json({
            code: "error",
            message: "An error occurred while updating!"
        });
    }
};


module.exports.deletePatch = async (req, res) => {
    try {
        if (!req.pers.includes("category-delete")) {
            res.json({
                code: "error",
                message: "Access denied!"
            });
            return;
        }
        const id = req.params.id;

        // 1. Kiểm tra danh mục có tồn tại và chưa bị xóa hay không
        const categoryDetail = await Category.findOne({
            _id: id,
            deleted: false
        });

        if (!categoryDetail) {
            return res.json({
                code: "error",
                message: "Category not found!"
            });
        }

        // 2. Cập nhật trạng thái xóa
        await Category.updateOne(
            {
                _id: id,
                deleted: false
            },
            {
                deleted: true,
                deletedBy: (req.account && req.account.id) ? req.account.id : "system",
                deletedAt: new Date() // Hoặc Date.now()
            }
        );

        res.json({
            code: "success",
            message: "Category deleted successfully!"
        });

    } catch (error) {
        console.error("Lỗi DeletePatch:", error);
        res.json({
            code: "error",
            message: "An error occurred while deleting!"
        });
    }
};


module.exports.changeMultiPatch = async (req, res) => {
    try {
        const { listId, option } = req.body;
        const updatedBy = req.account.id;

        switch (option) {
            case "active":
            case "inactive":
                await Category.updateMany(
                    {
                        _id: { $in: listId },
                        deleted: false
                    },
                    {
                        status: option,
                        updatedBy: updatedBy
                    }
                );
                res.json({
                    code: "success",
                    message: "Status updated successfully!"
                });
                break;

            case "delete":
                await Category.updateMany(
                    {
                        _id: { $in: listId },
                        deleted: false
                    },
                    {
                        deleted: true,
                        deletedBy: updatedBy,
                        deletedAt: new Date()
                    }
                );
                res.json({
                    code: "success",
                    message: "Records deleted successfully!"
                });
                break;

            default:
                res.json({
                    code: "error",
                    message: "Invalid data!"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: "error",
            message: "An error occurred, please try again!"
        });
    }
};