const Order = require("../../models/order.model");
const { paymentMethodList, paymentStatusList, statusList } = require("../../configs/variable.config");
const moment = require("moment");
const  City  =  require ( "../../models/city.model" );
const  axios  =  require ('axios').default ;
const  CryptoJS  =  require ('crypto-js');

// [GET] /admin/orders
module.exports.list = async (req, res) => {
    try {
        // 1. Khởi tạo điều kiện tìm kiếm mặc định
        const find = { deleted: false };

        // 2. Lọc theo trạng thái đơn hàng (pending / completed / cancelled)
        if (req.query.status) {
            find.status = req.query.status;
        }

        // 3. Lọc theo phương thức thanh toán (money / bank / momo / zalopay)
        if (req.query.paymentMethod) {
            find.paymentMethod = req.query.paymentMethod;
        }

        // 4. Lọc theo trạng thái thanh toán (unpaid / paid)
        if (req.query.paymentStatus) {
            find.paymentStatus = req.query.paymentStatus;
        }

        // 5. Lọc theo khoảng thời gian tạo đơn hàng
        const filterDate = {};
        if (req.query.startDate) {
            filterDate.$gte = moment(req.query.startDate).startOf("day").toDate();
        }
        if (req.query.endDate) {
            filterDate.$lte = moment(req.query.endDate).endOf("day").toDate();
        }
        if (Object.keys(filterDate).length > 0) {
            find.createdAt = filterDate;
        }

        // 6. Tìm kiếm theo từ khóa trên fullName, phone, code
        if (req.query.keyword) {
            const regex = new RegExp(req.query.keyword.trim(), "i");
            find.$or = [
                { fullName: regex },
                { phone: regex },
                { code: regex }
            ];
        }

        // 7. Phân trang
        const limitItems = 5;
        const page = parseInt(req.query.page) || 1;
        const totalRecord = await Order.countDocuments(find);
        const totalPage = Math.ceil(totalRecord / limitItems);
        const skip = (page - 1) * limitItems;

        const pagination = {
            currentPage: page,
            totalPage: totalPage,
            totalRecord: totalRecord,
            limitItems: limitItems,
            skip: skip
        };

        // 8. Lấy danh sách đơn hàng theo điều kiện lọc, có phân trang
        const orderList = await Order.find(find)
            .sort({ createdAt: "desc" })
            .limit(limitItems)
            .skip(skip);

        // 8. Duyệt qua từng đơn hàng để chuyển đổi dữ liệu hiển thị
        for (const orderDetail of orderList) {
            // Tìm tên phương thức thanh toán tương ứng từ config
            const method = paymentMethodList.find(item => item.value == orderDetail.paymentMethod);
            orderDetail.paymentMethodName = method ? method.label : orderDetail.paymentMethod;

            // Tìm tên trạng thái thanh toán
            const payStatus = paymentStatusList.find(item => item.value == orderDetail.paymentStatus);
            orderDetail.paymentStatusName = payStatus ? payStatus.label : orderDetail.paymentStatus;

            // Lấy thông tin chi tiết trạng thái (label, color...)
            orderDetail.statusDetail = statusList.find(item => item.value == orderDetail.status);

            // Định dạng ngày giờ bằng moment
            orderDetail.createdAtTime = moment(orderDetail.createdAt).format("HH:mm");
            orderDetail.createdAtDate = moment(orderDetail.createdAt).format("DD/MM/YYYY");
        }

        // 9. Render giao diện quản lý đơn hàng, truyền thêm lists, query và pagination
        res.render('admin/pages/order-list', {
            pageTitle: "Order Management",
            orderList: orderList,
            statusList: statusList,
            paymentMethodList: paymentMethodList,
            paymentStatusList: paymentStatusList,
            query: req.query,
            pagination: pagination
        });

    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        res.redirect("back");
    }
};

// [GET] /admin/order/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Tìm đơn hàng cụ thể theo ID và chưa bị xóa
        const orderDetail = await Order.findOne({
            _id: id,
            deleted: false
        });

        if (!orderDetail) {
            res.redirect(`/${pathAdmin}/order/list`);
            return;
        }

        // 2. Định dạng lại thời gian tạo đơn hàng
        orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");

        // 3. Xử lý danh sách các tour (items) trong đơn hàng
        for (const item of orderDetail.items) {
            // Định dạng ngày khởi hành
            item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");

            // Lấy tên thành phố khởi hành từ Database
            const city = await City.findOne({
                _id: item.locationFrom
            });

            if (city) {
                item.locationFromName = city.name;
            }
        }

        // 4. Trả về giao diện chỉnh sửa đơn hàng
        res.render('admin/pages/order-edit', {
            pageTitle: `Order: ${orderDetail.code}`,
            paymentMethodList: paymentMethodList,
            paymentStatusList: paymentStatusList,
            statusList: statusList,
            orderDetail: orderDetail
        });

    } catch (error) {
        res.redirect(`/${pathAdmin}/order/list`);
    }
};

// [PATCH] /admin/order/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Kiểm tra đơn hàng có tồn tại không trước khi cập nhật
        const orderDetail = await Order.findOne({
            _id: id,
            deleted: false
        });

        if (!orderDetail) {
            return res.json({
                code: "error",
                message: "Order not found!"
            });
        }

        // 2. Cập nhật các thông tin mới từ form gửi lên (req.body)
        await Order.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        res.json({
            code: "success",
            message: "Order updated successfully!"
        });

    } catch (error) {
        res.json({
            code: "error",
            message: "Update failed!"
        });
    }
};

