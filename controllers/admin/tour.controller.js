const Category = require("../../models/category.model");
const City = require("../../models/city.model");
const { buildCategoryTree } = require("../../helpers/category.helper");
const Tour = require("../../models/tour.model");

const AccountAdmin = require("../../models/account.admin.model");

const moment = require("moment");

module.exports.list = async (req, res) => {
    // 1. Thiết lập điều kiện tìm kiếm mặc định
    const find = {
        deleted: false
    };

    try {
        // 2. Lấy danh sách Tour và sắp xếp theo vị trí giảm dần
        const tourList = await Tour.find(find).sort({ position: "desc" });

        // 3. Duyệt qua từng Tour để lấy thông tin người tạo/người sửa
        for (const item of tourList) {
            // Xử lý thông tin người tạo
            if (item.createdBy) {
                const infoAccount = await AccountAdmin.findOne({
                    _id: item.createdBy
                });
                
                if (infoAccount) {
                    item.createdByFullName = infoAccount.fullName;
                }
            }
            
            // Format ngày tạo
            if (item.createdAt) {
                item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
            }

            // Xử lý thông tin người cập nhật
            if (item.updatedBy) {
                const infoAccount = await AccountAdmin.findOne({
                    _id: item.updatedBy
                });

                if (infoAccount) {
                    item.updatedByFullName = infoAccount.fullName;
                }
            }
            
            // Format ngày cập nhật
            if (item.updatedAt) {
                item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
            }
        }

        // 4. Trả về giao diện (hoặc JSON tùy theo logic của bạn)
        res.render("admin/pages/tour-list", {
            pageTitle: "Danh sách Tour",
            tourList: tourList
        });

    } catch (error) {
        console.error("Lỗi lấy danh sách Tour:", error);
        res.redirect("back");
    }
};

// [GET] /admin/tours/create
module.exports.create = async (req, res) => {
    const categoryList = await Category.find({
        deleted: false
    });

    const categoryTree = buildCategoryTree(categoryList);
    const cityList = await City.find({});

    res.render('admin/pages/tour-create', {
        pageTitle: "Tạo tour",
        categoryList: categoryTree,
        cityList: cityList
    });
};

// [POST] /admin/tours/create
module.exports.createPost = async (req, res) => {
    // 1. Xử lý ảnh đại diện (Avatar - Base64)
    if (req.files && req.files["avatar"] && req.files["avatar"].length > 0) {
        const file = req.files["avatar"][0];
        const mimetype = file.mimetype;
        const base64 = file.buffer.toString("base64");
        
        // Lưu chuỗi Data URI vào database thay vì path
        req.body.avatar = `data:${mimetype};base64,${base64}`;
    } else {
        // Nếu là trang Edit, bạn nên cân nhắc bỏ dòng này để giữ lại ảnh cũ trong DB
        req.body.avatar = ""; 
    }

    // 2. Kiểm tra và xử lý danh sách ảnh chi tiết (Images - Base64)
    if (req.files && req.files["images"] && req.files["images"].length > 0) {
        // Sử dụng .map() để duyệt qua từng file và chuyển đổi sang Base64
        req.body.images = req.files["images"].map(file => {
            const mimetype = file.mimetype;
            const base64 = file.buffer.toString("base64");
            
            return `data:${mimetype};base64,${base64}`;
        });
    } else {
        // Tương tự, nếu là trang Edit, việc gán mảng rỗng sẽ xóa sạch ảnh cũ
        req.body.images = []; 
    }
    // 2. Xử lý vị trí (Position)
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const record = await Tour.findOne({}).sort({ position: "desc" });
        if (record) {
            req.body.position = record.position + 1;
        } else {
            req.body.position = 1;
        }
    }

    // 3. Xử lý giá tiền và số lượng (Parse về số nguyên)
    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;

    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;

    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;

    // 4. Xử lý các mảng dữ liệu JSON (Địa điểm và Lịch trình)
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

    // 5. Xử lý ngày khởi hành
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;

    // 6. Thông tin người tạo
    req.body.createdBy = req.account.id;

    console.log(req.body);

    // 7. Lưu vào database
    try {
        const newRecord = new Tour(req.body);
        await newRecord.save();

        res.json({
            code: "success",
            message: "Đã tạo tour thành công!"
        });
    } catch (error) {
        res.json({
            code: "error",
            message: "Tạo tour thất bại!"
        });
    }
};

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Tìm kiếm thông tin chi tiết của Tour theo ID từ URL
        const tourDetail = await Tour.findOne({
            _id: id,
            deleted: false
        });

        // Nếu không tìm thấy tour, điều hướng quay lại trang danh sách
        if (!tourDetail) {
            res.redirect(`/${pathAdmin}/tour/list`);
            return;
        }

        // 2. Định dạng lại ngày khởi hành để hiển thị chính xác trong thẻ input type="date"
        // Thẻ input date yêu cầu định dạng chuẩn là YYYY-MM-DD
        if (tourDetail.departureDate) {
            tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("YYYY-MM-DD");
        }

        // 3. Lấy dữ liệu danh mục để xây dựng cấu trúc cây (Category Tree)
        const categoryList = await Category.find({
            deleted: false
        });
        const categoryTree = buildCategoryTree(categoryList);

        // 4. Lấy danh sách các tỉnh/thành phố (City) để hiển thị các ô checkbox địa điểm
        const cityList = await City.find({});

        // 5. Render giao diện chỉnh sửa với đầy đủ dữ liệu cần thiết
        res.render('admin/pages/tour-edit', {
            pageTitle: "Chỉnh sửa tour",
            categoryList: categoryTree,
            tourDetail: tourDetail,
            cityList: cityList
        });

    } catch (error) {
        // Xử lý lỗi tập trung bằng cách quay lại trang danh sách
        console.error("Lỗi trang chỉnh sửa:", error);
        res.redirect(`/${pathAdmin}/tour/list`);
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Kiểm tra sự tồn tại của Tour trước khi cập nhật
        const tourDetail = await Tour.findOne({
            _id: id,
            deleted: false
        });

        if (!tourDetail) {
            return res.json({
                code: "error",
                message: "Tour không tồn tại!"
            });
        }

        // 1. Xử lý ảnh đại diện (Avatar - Base64)
        if (req.files && req.files["avatar"] && req.files["avatar"].length > 0) {
            const file = req.files["avatar"][0];
            const mimetype = file.mimetype;
            const base64 = file.buffer.toString("base64");
            
            // Lưu chuỗi Data URI vào database thay vì path
            req.body.avatar = `data:${mimetype};base64,${base64}`;
        } else {
            // Nếu là trang Edit, bạn nên cân nhắc bỏ dòng này để giữ lại ảnh cũ trong DB
            // req.body.avatar = ""; 
        }

        // 2. Kiểm tra và xử lý danh sách ảnh chi tiết (Images - Base64)
        if (req.files && req.files["images"] && req.files["images"].length > 0) {
            // Sử dụng .map() để duyệt qua từng file và chuyển đổi sang Base64
            req.body.images = req.files["images"].map(file => {
                const mimetype = file.mimetype;
                const base64 = file.buffer.toString("base64");
                
                return `data:${mimetype};base64,${base64}`;
            });
        } else {
            // Tương tự, nếu là trang Edit, việc gán mảng rỗng sẽ xóa sạch ảnh cũ
            // req.body.images = []; 
        }

        // 3. Xử lý vị trí (Position)
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            const record = await Tour.findOne({ deleted: false }).sort({ position: "desc" });
            if (record) {
                req.body.position = record.position + 1;
            } else {
                req.body.position = 1;
            }
        }

        // 4. Chuyển đổi các trường giá và số lượng sang kiểu Number
        req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
        req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
        req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;

        req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
        req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
        req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;

        req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
        req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
        req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;

        // 5. Giải mã dữ liệu JSON từ Frontend (Địa điểm và Lịch trình)
        req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
        req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

        // 6. Xử lý ngày khởi hành
        req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;

        // 7. Lưu thông tin người thực hiện cập nhật
        req.body.updatedBy = req.account.id;

        // 8. Thực hiện cập nhật vào Database
        await Tour.updateOne(
            {
                _id: id,
                deleted: false
            },
            req.body
        );

        res.json({
            code: "success",
            message: "Đã cập nhật tour thành công!"
        });

    } catch (error) {
        console.error("Lỗi cập nhật tour:", error);
        res.json({
            code: "error",
            message: "Cập nhật tour thất bại!"
        });
    }
};

// [PATCH] /admin/tour/delete/:id
module.exports.deletePatch = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Kiểm tra xem tour có tồn tại và chưa bị xóa hay không
        const tourDetail = await Tour.findOne({
            _id: id,
            deleted: false
        });

        if (!tourDetail) {
            return res.json({
                code: "error",
                message: "Tour không tồn tại!"
            });
        }

        // 2. Thực hiện xóa mềm (Soft Delete)
        // Cập nhật trường deleted và lưu vết người thực hiện xóa
        await Tour.updateOne(
            {
                _id: id,
                deleted: false
            },
            {
                deleted: true,
                deletedBy: req.account.id, // Lưu ID của admin thực hiện hành động này
                deletedAt: new Date()      // Ghi lại thời điểm xóa
            }
        );

        // 3. Phản hồi kết quả về phía Client (Frontend)
        res.json({
            code: "success",
            message: "Đã xóa tour thành công!"
        });

    } catch (error) {
        console.error("Lỗi xóa tour:", error);
        res.json({
            code: "error",
            message: "Xóa tour thất bại!"
        });
    }
};

// [GET] /admin/tours/trash
// [GET] /admin/tours/trash
module.exports.trash = async (req, res) => {
    // 1. Chỉ tìm các bản ghi đã được đánh dấu xóa (deleted: true)
    const find = {
        deleted: true
    };

    try {
        // 2. Lấy danh sách tour trong thùng rác, sắp xếp theo thời gian xóa mới nhất
        const tourList = await Tour.find(find).sort({
            deletedAt: "desc"
        });

        // 3. Duyệt qua danh sách để lấy thông tin chi tiết về người tạo và người xóa
        for (const item of tourList) {
            // Lấy thông tin người tạo bản ghi ban đầu
            if (item.createdBy) {
                const infoAccount = await AccountAdmin.findOne({
                    _id: item.createdBy
                });
                
                if (infoAccount) {
                    item.createdByFullName = infoAccount.fullName;
                }
            }
            
            // Định dạng ngày tạo
            if (item.createdAt) {
                item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
            }

            // Lấy thông tin người đã thực hiện hành động xóa
            if (item.deletedBy) {
                const infoAccount = await AccountAdmin.findOne({
                    _id: item.deletedBy
                });

                if (infoAccount) {
                    item.deletedByFullName = infoAccount.fullName;
                }
            }
            
            // Định dạng ngày xóa
            if (item.deletedAt) {
                item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY");
            }
        }

        // 4. Render giao diện thùng rác
        res.render('admin/pages/tour-trash', {
            pageTitle: "Thùng rác tour",
            tourList: tourList
        });

    } catch (error) {
        console.error("Lỗi trang thùng rác:", error);
        res.redirect("back");
    }
};

// [PATCH] /admin/tour/undo/:id
module.exports.undoPatch = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Kiểm tra xem tour có tồn tại trong thùng rác hay không (deleted: true)
        const tourDetail = await Tour.findOne({
            _id: id,
            deleted: true
        });

        if (!tourDetail) {
            return res.json({
                code: "error",
                message: "Tour không tồn tại trong thùng rác!"
            });
        }

        // 2. Thực hiện khôi phục (đưa deleted về false)
        await Tour.updateOne(
            {
                _id: id,
                deleted: true
            },
            {
                deleted: false,
                // Sử dụng $unset để xóa bỏ các trường dữ liệu liên quan đến hành động xóa
                $unset: { 
                    deletedBy: "", 
                    deletedAt: "" 
                } 
            }
        );

        // 3. Phản hồi kết quả về phía Client (Frontend)
        res.json({
            code: "success",
            message: "Đã khôi phục tour thành công!"
        });

    } catch (error) {
        console.error("Lỗi khôi phục tour:", error);
        res.json({
            code: "error",
            message: "Khôi phục tour thất bại!"
        });
    }
};

// [PATCH] /admin/tour/undo/:id
module.exports.undoPatch = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Kiểm tra xem tour có tồn tại trong thùng rác hay không (deleted: true)
        const tourDetail = await Tour.findOne({
            _id: id,
            deleted: true
        });

        if (!tourDetail) {
            return res.json({
                code: "error",
                message: "Tour không tồn tại trong thùng rác!"
            });
        }

        // 2. Thực hiện khôi phục (đưa trường deleted về false)
        await Tour.updateOne(
            {
                _id: id,
                deleted: true
            },
            {
                deleted: false,
                // Sử dụng $unset để xóa bỏ thông tin người xóa và thời gian xóa
                $unset: { 
                    deletedBy: "", 
                    deletedAt: "" 
                } 
            }
        );

        // 3. Phản hồi kết quả về phía Client (Frontend)
        res.json({
            code: "success",
            message: "Đã khôi phục tour thành công!"
        });

    } catch (error) {
        console.error("Lỗi khôi phục tour:", error);
        res.json({
            code: "error",
            message: "Khôi phục tour thất bại!"
        });
    }
};

// [DELETE] /admin/tour/destroy/:id
module.exports.destroyDel = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Kiểm tra xem tour có tồn tại trong thùng rác hay không (deleted: true)
        const tourDetail = await Tour.findOne({
            _id: id,
            deleted: true
        });

        if (!tourDetail) {
            return res.json({
                code: "error",
                message: "Tour không tồn tại trong thùng rác!"
            });
        }

        // 2. Thực hiện xóa vĩnh viễn (gỡ bỏ hoàn toàn khỏi database)
        await Tour.deleteOne({
            _id: id,
            deleted: true
        });

        // 3. Phản hồi kết quả về phía Client (Frontend)
        res.json({
            code: "success",
            message: "Đã xóa vĩnh viễn tour thành công!"
        });

    } catch (error) {
        console.error("Lỗi xóa vĩnh viễn tour:", error);
        res.json({
            code: "error",
            message: "Xóa vĩnh viễn tour thất bại!"
        });
    }
};
