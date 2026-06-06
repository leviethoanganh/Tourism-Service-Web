const  {  permissionList  }  =  require ( "../../configs/variable.config" );
const  Role  =  require ( "../../models/role.model" );
const  AccountAdmin  =  require ( "../../models/account.admin.model" );
const  moment  =  require ( "moment" );
const  bcrypt  =  require ( "bcryptjs" );

const  SettingWebsiteInfo  =  require("../../models/setting-website-infor.model");

module.exports.list = (req, res) => {
    res.render('admin/pages/setting-list', {
        pageTitle: "General Settings"
    });
};

module.exports.websiteInfo = async (req, res) => {
    // 1. Lấy thông tin từ Database
    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

    // 2. Trả về giao diện và truyền dữ liệu sang view
    res.render("admin/pages/setting-website-info", {
        pageTitle: "Website Information",
        settingWebsiteInfo: settingWebsiteInfo,
    });
};

module.exports.websiteInfoPatch = async (req, res) => {
    try {
        // 1. Xóa các trường cũ để chuẩn bị cập nhật dữ liệu mới
        delete req.body.logo;
        delete req.body.favicon;

        // 2. Xử lý dữ liệu file từ Buffer sang Base64
        if (req.files) {
            // Xử lý LOGO
            if (req.files.logo && req.files.logo[0]) {
                const logoFile = req.files.logo[0];
                const base64 = logoFile.buffer.toString("base64");
                req.body.logo = `data:${logoFile.mimetype};base64,${base64}`;
            }

            // Xử lý FAVICON
            if (req.files.favicon && req.files.favicon[0]) {
                const faviconFile = req.files.favicon[0];
                const base64 = faviconFile.buffer.toString("base64");
                req.body.favicon = `data:${faviconFile.mimetype};base64,${base64}`;
            }
        }

        console.log("Dữ liệu Body sau khi xử lý file:", req.body);

        // 3. Kiểm tra và cập nhật Database
        const existRecord = await SettingWebsiteInfo.findOne({});

        if (!existRecord) {
            req.body.createdBy = req.account.id;
            const newRecord = new SettingWebsiteInfo(req.body);
            await newRecord.save();
        } else {
            req.body.updatedBy = req.account.id;
            await SettingWebsiteInfo.updateOne({}, req.body);
        }

        res.json({
            code: "success",
            message: "Website information updated successfully!",
        });
    } catch (error) {
        console.error("Lỗi cập nhật website info:", error);
        res.json({
            code: "error",
            message: "An error occurred, please try again later!",
        });
    }
};
module.exports.accountAdminList = async (req, res) => {
    // 1. Lấy danh sách tài khoản chưa bị xóa, sắp xếp theo ngày tạo mới nhất
    const accountAdminList = await AccountAdmin.find({
        deleted: false
    }).sort({
        createdAt: "desc"
    });

    // 2. Duyệt qua từng tài khoản để lấy tên nhóm quyền tương ứng
    for (const item of accountAdminList) {
        if (item.role) {
            const role = await Role.findOne({
                _id: item.role,
                deleted: false
            });

            if (role) {
                // Gán thêm thuộc tính roleName để hiển thị ở giao diện
                item.roleName = role.name;
            }
        }
    }

    // 3. Render giao diện và truyền dữ liệu sang file Pug
    res.render('admin/pages/setting-account-admin-list', {
        pageTitle: "Admin Accounts",
        accountAdminList: accountAdminList
    });
};

module.exports.accountAdminCreate = async (req, res) => {
    const roleList = await Role.find({
        deleted: false
    });

    res.render('admin/pages/setting-account-admin-create', {
        pageTitle: "Create Admin Account",
        roleList: roleList
    });
};

module.exports.accountAdminCreatePost = async (req, res) => {
    const existEmail = await AccountAdmin.findOne({
        email: req.body.email
    });

    if (existEmail) {
        res.json({
            code: "error",
            message: "Email already exists in the system!"
        });
        return;
    }

    if (req.file) {
        // Nếu dùng Memory Storage, file nằm trong req.file.buffer
        // Chuyển sang base64 để lưu vào MongoDB (nếu avatar là String)
        const mimetype = req.file.mimetype;
        const base64 = req.file.buffer.toString("base64");
        req.body.avatar = `data:${mimetype};base64,${base64}`;
    } else {
        req.body.avatar = "";
    }

    console.log(req.file.path);

    req.body.createdBy = req.account.id;

    // Mã hóa mật khẩu
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const newAccount = new AccountAdmin(req.body);
    await newAccount.save();

    console.log("Đã tạo tài khoản quản trị mới:", newAccount);

    res.json({
        code: "success",
        message: "Admin account created successfully!"
    });
};

module.exports.accountAdminEdit = async (req, res) => {
    try {
        const id = req.params.id;

        const accountDetail = await AccountAdmin.findOne({
            _id: id,
            deleted: false
        });

        if (!accountDetail) {
            res.redirect(`/${pathAdmin}/setting/account-admin/list`);
            return;
        }

        const roleList = await Role.find({
            deleted: false
        });

        res.render('admin/pages/setting-account-admin-edit', {
            pageTitle: "Edit Admin Account",
            roleList: roleList,
            accountDetail: accountDetail
        });
    } catch (error) {
        res.redirect(`/${pathAdmin}/setting/account-admin/list`);
    }
};

module.exports.accountAdminEditPatch = async (req, res) => {
    try {
        const id = req.params.id;

        const accountDetail = await AccountAdmin.findOne({
            _id: id,
            deleted: false
        });

        if (!accountDetail) {
            return res.json({
                code: "error",
                message: "Account not found!"
            });
        }

        const existEmail = await AccountAdmin.findOne({
            _id: { $ne: id }, // Loại trừ ID hiện tại khi kiểm tra trùng email 
            email: req.body.email,
            deleted: false
        });

        if (existEmail) {
            return res.json({
                code: "error",
                message: "Email already exists in the system!"
            });
        }

        // 2. Xử lý ảnh đại diện (Avatar)
        // Nếu có file mới thì cập nhật, nếu không thì giữ nguyên ảnh cũ
        if (req.file) {
                // Nếu dùng Memory Storage, file nằm trong req.file.buffer
                // Chuyển sang base64 để lưu vào MongoDB (nếu avatar là String)
                const mimetype = req.file.mimetype;
                const base64 = req.file.buffer.toString("base64");
                req.body.avatar = `data:${mimetype};base64,${base64}`;
            } else {
                req.body.avatar = "";
        }

        // Xử lý mật khẩu (Nếu để trống thì không cập nhật mật khẩu mới)
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        } else {
            delete req.body.password;
        }

        req.body.updatedBy = req.account.id;

        await AccountAdmin.updateOne(
            {
                _id: id,
                deleted: false
            },
            req.body
        );

        res.json({
            code: "success",
            message: "Admin account updated successfully!"
        });
    } catch (error) {
        res.json({
            code: "error",
            message: "Update failed!"
        });
    }
};

module.exports.roleList = async (req, res) => {
    // 1. Thiết lập điều kiện tìm kiếm bản ghi chưa bị xóa
    const find = {
        deleted: false
    };

    // 2. Lấy danh sách nhóm quyền và sắp xếp theo ngày tạo mới nhất
    const roleList = await Role.find(find).sort({
        createdAt: "desc"
    });

    // 3. Duyệt qua từng nhóm quyền để lấy thông tin người tạo/người sửa
    for (const item of roleList) {
        // Xử lý thông tin người tạo
        if (item.createdBy) {
            const infoAccount = await AccountAdmin.findOne({
                _id: item.createdBy
            });
            
            if (infoAccount) {
                item.createdByFullName = infoAccount.fullName;
            }
        }
        
        // Format ngày tạo bằng moment
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

    // 4. Render giao diện và truyền dữ liệu
    res.render('admin/pages/setting-role-list', {
        pageTitle: "Roles",
        roleList: roleList
    });
};

module.exports.roleCreate = (req, res) => {
    res.render('admin/pages/setting-role-create', {
    pageTitle :  "Create Role",
    permissionList :  permissionList
    });
};

module.exports.roleCreatePost = async (req, res) => {
    try {
        // 1. Gán ID của tài khoản đang đăng nhập vào trường createdBy
        req.body.createdBy = req.account.id;

        // 2. Khởi tạo bản ghi mới từ dữ liệu req.body
        const newRecord = new Role(req.body);

        // 3. Lưu bản ghi vào database
        await newRecord.save();

        // 4. Trả về kết quả JSON cho phía Frontend
        res.json({
            code: "success",
            message: "Role created successfully!"
        });
    } catch (error) {
        // Xử lý nếu có lỗi xảy ra (ví dụ: trùng tên, lỗi kết nối...)
        res.json({
            code: "error",
            message: "Failed to create role!"
        });
    }
};

// [GET] /admin/setting/role/edit/:id
module.exports.roleEdit = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Tìm kiếm thông tin chi tiết của nhóm quyền theo ID
        const roleDetail = await Role.findOne({
            _id: id,
            deleted: false
        });

        // 2. Nếu không tìm thấy, điều hướng quay lại trang danh sách
        if (!roleDetail) {
            res.redirect(`/${pathAdmin}/setting/role/list`);
            return;
        }

        // 3. Render giao diện và truyền dữ liệu cần thiết
        res.render('admin/pages/setting-role-edit', {
            pageTitle: "Edit Role",
            permissionList: permissionList,
            roleDetail: roleDetail
        });
    } catch (error) {
        // Xử lý lỗi bằng cách quay lại trang danh sách
        res.redirect(`/${pathAdmin}/setting/role/list`);
    }
};

// [PATCH] /admin/setting/role/edit/:id
module.exports.roleEditPatch = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Kiểm tra sự tồn tại của nhóm quyền trước khi cập nhật
        const roleDetail = await Role.findOne({
            _id: id,
            deleted: false
        });

        if (!roleDetail) {
            return res.json({
                code: "error",
                message: "Invalid data!"
            });
        }

        // 2. Cập nhật thông tin người sửa và thực hiện update vào Database
        req.body.updatedBy = req.account.id;

        await Role.updateOne(
            {
                _id: id,
                deleted: false
            },
            req.body
        );

        // 3. Phản hồi kết quả về phía Client
        res.json({
            code: "success",
            message: "Updated successfully!"
        });
    } catch (error) {
        // Trả về lỗi nếu quá trình cập nhật thất bại
        res.json({
            code: "error",
            message: "Update failed!"
        });
    }
};

