const AccountAdmin = require("../../models/account.admin.model");
const Order = require("../../models/order.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    try {
        // 1. Khởi tạo đối tượng lưu trữ thông số tổng quan
        const overview = {
            totalAdmin: 0,
            totalOrder: 0,
            totalRevenue: 0
        };

        // 2. Thống kê tổng số tài khoản Admin chưa bị xóa
        overview.totalAdmin = await AccountAdmin.countDocuments({
            deleted: false
        });

        // 3. Lấy danh sách đơn hàng để tính toán
        const orderList = await Order.find({
            deleted: false
        });

        // Thống kê tổng số đơn hàng
        overview.totalOrder = orderList.length;

        // Tính tổng doanh thu bằng hàm reduce
        overview.totalRevenue = orderList.reduce((total, item) => total + (item.total || 0), 0);

        // 4. Render giao diện bảng điều khiển
        res.render('admin/pages/dashboard', {
            pageTitle: "Tổng quan",
            overview: overview
        });

    } catch (error) {
        console.error("Lỗi trang Dashboard:", error);
        res.redirect("back");
    }
};

// [POST] /admin/dashboard/revenue-chart
module.exports.revenueChartPost = async (req, res) => {
    try {
        // 1. Lấy dữ liệu thời gian từ phía Frontend gửi lên
        const { 
            currentMonth, 
            currentYear, 
            previousMonth, 
            previousYear, 
            arrayDay 
        } = req.body;

        // 2. Truy vấn tất cả đơn hàng trong tháng hiện tại
        const ordersCurrentMonth = await Order.find({
            deleted: false,
            createdAt: {
                $gte: new Date(currentYear, currentMonth - 1, 1), // Mùng 1 tháng này
                $lt: new Date(currentYear, currentMonth, 1)      // Mùng 1 tháng sau
            }
        });

        // 3. Truy vấn tất cả đơn hàng trong tháng trước
        const ordersPreviousMonth = await Order.find({
            deleted: false,
            createdAt: {
                $gte: new Date(previousYear, previousMonth - 1, 1),
                $lt: new Date(previousYear, previousMonth, 1)
            }
        });

        // 4. Khởi tạo mảng chứa doanh thu để vẽ biểu đồ
        const dataMonthCurrent = [];
        const dataMonthPrevious = [];

        // Duyệt qua từng ngày trong tháng để gom nhóm doanh thu
        for (const day of arrayDay) {
            // Tính doanh thu cho ngày đó trong tháng hiện tại
            let revenueCurrent = 0;
            for (const order of ordersCurrentMonth) {
                const orderDate = new Date(order.createdAt).getDate();
                if (orderDate === day) {
                    revenueCurrent += (order.total || 0);
                }
            }
            dataMonthCurrent.push(revenueCurrent);

            // Tính doanh thu cho ngày đó trong tháng trước
            let revenuePrevious = 0;
            for (const order of ordersPreviousMonth) {
                const orderDate = new Date(order.createdAt).getDate();
                if (orderDate === day) {
                    revenuePrevious += (order.total || 0);
                }
            }
            dataMonthPrevious.push(revenuePrevious);
        }

        // 5. Trả kết quả về cho Frontend để vẽ biểu đồ
        res.json({
            code: "success",
            dataMonthCurrent: dataMonthCurrent,
            dataMonthPrevious: dataMonthPrevious
        });

    } catch (error) {
        console.error("Lỗi lấy dữ liệu biểu đồ:", error);
        res.json({
            code: "error",
            message: "Không thể lấy dữ liệu doanh thu"
        });
    }
};