const Order = require("../../models/order.model");
const { paymentMethodList, paymentStatusList, statusList } = require("../../configs/variable.config");
const moment = require("moment");
const  City  =  require ( "../../models/city.model" );
const  axios  =  require ('axios').default ;
const  CryptoJS  =  require ('crypto-js');

// [GET] /admin/orders
module.exports.list = async (req, res) => {
    try {
        // 1. Lấy danh sách đơn hàng chưa bị xóa, sắp xếp mới nhất lên đầu
        const orderList = await Order.find({
            deleted: false
        }).sort({
            createdAt: "desc"
        });

        // 2. Duyệt qua từng đơn hàng để chuyển đổi dữ liệu hiển thị
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

        // 3. Render giao diện quản lý đơn hàng
        res.render('admin/pages/order-list', {
            pageTitle: "Quản lý đơn hàng",
            orderList: orderList
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
            pageTitle: `Đơn hàng: ${orderDetail.code}`,
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
                message: "Đơn hàng không tồn tại!"
            });
        }

        // 2. Cập nhật các thông tin mới từ form gửi lên (req.body)
        await Order.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        res.json({
            code: "success",
            message: "Đã cập nhật đơn hàng!"
        });

    } catch (error) {
        res.json({
            code: "error",
            message: "Cập nhật thất bại!"
        });
    }
};

