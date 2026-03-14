const { paymentMethodList, paymentStatusList, statusList } = require("../../configs/variable.config");
const { generateRandomNumber } = require("../../helpers/generate.helper");
const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model");
const City = require("../../models/city.model");
const moment = require("moment");


// [POST] /order/create
module.exports.createPost = async (req, res) => {
    try {
        // 1. Lấy dữ liệu từ body (Sửa lỗi bodysuit thành body)
        const { fullName, phone, note, paymentMethod, items } = req.body;

        // 2. Tạo mã đơn hàng ngẫu nhiên
        const orderCode = "OD" + generateRandomNumber(10);

        // 3. Cập nhật thông tin chi tiết tour vào mảng items gửi lên
        for (const item of items) {
            const tourDetail = await Tour.findOne({
                _id: item.tourId,
                deleted: false,
                status: "active"
            });

            if (!tourDetail) {
                res.json({
                    code: "error",
                    message: `Tour với ID ${item.tourId} không tồn tại hoặc đã bị xóa/hủy. Vui lòng kiểm tra lại giỏ hàng!`
                });
                return;
            }

            // Đồng bộ giá và thông tin từ Database để tránh khách hàng can thiệp giá ở Frontend
            item.priceNewAdult = tourDetail.priceNewAdult;
            item.priceNewChildren = tourDetail.priceNewChildren;
            item.priceNewBaby = tourDetail.priceNewBaby;
            item.departureDate = tourDetail.departureDate;
            item.name = tourDetail.name;
            item.avatar = tourDetail.avatar;
        }

        // 4. Tính toán subTotal, discount, total
        let subTotal = 0;
        const discount = 0; 

        for (const item of items) {
            subTotal += (item.priceNewAdult * item.quantityAdult) +
                (item.priceNewChildren * item.quantityChildren) +
                (item.priceNewBaby * item.quantityBaby);
        }

        const total = subTotal - discount;

        // 5. Thiết lập trạng thái đơn hàng mặc định
        const paymentStatus = "unpaid";
        const status = "initial";

        // 6. Chuẩn bị dữ liệu lưu vào Database (Đồng bộ Note thành note để khớp Model)
        const dataFinal = {
            code: orderCode,
            fullName: fullName,
            phone: phone,
            note: note,
            items: items,
            subTotal: subTotal,
            discount: discount,
            total: total,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            status: status
        };

        // 7. Lưu đơn hàng mới
        const newRecord = new Order(dataFinal);
        await newRecord.save();

        // 8. Cập nhật lại số lượng (stock) còn lại của từng tour
        for (const item of items) {
            const tourDetail = await Tour.findOne({
                _id: item.tourId,
                deleted: false,
                status: "active"
            });

            if (tourDetail) {
                tourDetail.stockAdult = tourDetail.stockAdult - item.quantityAdult;
                tourDetail.stockChildren = tourDetail.stockChildren - item.quantityChildren;
                tourDetail.stockBaby = tourDetail.stockBaby - item.quantityBaby;
                await tourDetail.save();
            }
        }

        // Trả về phản hồi thành công cùng ID đơn hàng để Frontend chuyển hướng
        res.json({
            code: "success",
            message: "Đặt hàng thành công!",
            orderCode: orderCode,
            orderId: newRecord.id
        });

    } catch (error) {
        console.error("Lỗi thực thi đặt hàng:", error);
        res.json({
            code: "error",
            message: "Đặt hàng thất bại! Vui lòng thử lại sau."
        });
    }
};

module.exports.success = async (req, res) => {
    try {
        const { orderCode, phone } = req.query;

        // Tìm đơn hàng dựa trên mã và số điện thoại
        const orderDetail = await Order.findOne({
            code: orderCode,
            phone: phone,
            deleted: false
        });

        if (!orderDetail) {
            res.redirect("/");
            return;
        }

        // 1. Chuyển đổi mã phương thức thanh toán sang tên hiển thị
        const method = paymentMethodList.find(item => item.value == orderDetail.paymentMethod);
        orderDetail.paymentMethodName = method ? method.label : orderDetail.paymentMethod;

        // 2. Chuyển đổi trạng thái thanh toán
        const payStatus = paymentStatusList.find(item => item.value == orderDetail.paymentStatus);
        orderDetail.paymentStatusName = payStatus ? payStatus.label : orderDetail.paymentStatus;

        // 3. Chuyển đổi trạng thái đơn hàng
        const orderStatus = statusList.find(item => item.value == orderDetail.status);
        orderDetail.statusName = orderStatus ? orderStatus.label : orderDetail.status;

        // 4. Định dạng ngày giờ đặt hàng
        orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");

        // 5. Xử lý thông tin chi tiết từng tour trong đơn hàng
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

        res.render('client/pages/order-success', {
            pageTitle: "Đặt hàng thành công",
            orderDetail: orderDetail
        });

    } catch (error) {
        console.error("Lỗi trang success:", error);
        res.redirect("/");
    }
}

// [GET] /order/payment-zalopay
module.exports.paymentZaloPay = async (req, res) => {
    try {
        const { orderCode, phone } = req.query;

        // 1. Tìm thông tin đơn hàng từ Database
        const orderDetail = await Order.findOne({
            code: orderCode,
            phone: phone,
            deleted: false
        });

        if (!orderDetail) {
            res.redirect("/");
            return;
        }

        // 2. Cấu hình thông số từ ZaloPay (Sandbox/Testing)
        const config = {
            app_id: "2554",
            key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
            key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
            endpoint: "https://sb-openapi.zalopay.vn/v2/create"
        };

        // Dữ liệu nhúng để ZaloPay quay lại trang Success sau khi thanh toán xong
        const embed_data = {
            redirecturl: `http://localhost:3000/order/success?orderCode=${orderCode}&phone=${phone}`
        };

        const items = [{}]; // Có thể bổ sung danh sách sản phẩm cụ thể vào đây
        const transID = Math.floor(Math.random() * 1000000);

        // 3. Tạo đối tượng đơn hàng theo yêu cầu của ZaloPay API
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // Mã giao dịch duy nhất trong ngày
            app_user: `${orderCode}`,
            app_time: Date.now(), // Thời gian tạo đơn hàng (miliseconds)
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: orderDetail.total, // Tổng tiền lấy từ Database
            description: `Thanh toán đơn hàng ${orderCode}`,
            bank_code: "", // Để trống để khách chọn phương thức trên trang ZaloPay
        };

        // 4. Tạo mã MAC (Chữ ký điện tử) để bảo mật giao dịch
        // Công thức: appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const dataStr = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        
        order.mac = CryptoJS.HmacSHA256(dataStr, config.key1).toString();

        // 5. Gọi API sang ZaloPay để lấy link thanh toán
        const response = await axios.post(config.endpoint, null, {
            params: order
        });

        // 6. Chuyển hướng người dùng sang trang thanh toán của ZaloPay
        if (response.data && response.data.order_url) {
            res.redirect(response.data.order_url);
        } else {
            res.redirect("back");
        }

    } catch (error) {
        console.error("Lỗi thanh toán ZaloPay:", error);
        res.redirect("/");
    }
};