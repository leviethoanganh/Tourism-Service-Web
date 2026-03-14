const { getCategorySubId } = require("../../helpers/category.helper");
const Category = require("../../models/category.model");
const Tour = require("../../models/tour.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
    try {
        const slug = req.params.slug;

        // 1. Tìm kiếm thông tin chi tiết của danh mục dựa trên slug
        const categoryDetail = await Category.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        });

        // Nếu không tìm thấy danh mục, điều hướng người dùng về trang chủ
        if (!categoryDetail) {
            res.redirect("/");
            return;
        }

        // 2. Lấy danh sách ID của tất cả danh mục con
        const categorySubId = await getCategorySubId(categoryDetail.id);

        // 3. Truy vấn danh sách tour thuộc danh mục này và các danh mục con
        const tourList = await Tour.find({
            category: {
                $in: [
                    categoryDetail.id,
                    ...categorySubId
                ]
            },
            deleted: false,
            status: "active"
        })
        .sort({ position: "desc" }) // Sửa .spell thành .sort để sắp xếp vị trí
        .limit(24); // Giới hạn hiển thị 24 tour cho trang danh sách

        // 4. Định dạng dữ liệu hiển thị (Ngày tháng và Giảm giá)
        for (const item of tourList) {
            if (item.departureDate) {
                item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
            }
            // Tính % giảm giá nếu cần hiển thị trên giao diện
            if (item.priceAdult > 0) {
                item.discount = Math.floor(((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100);
            }
        }

        // 5. Render giao diện và truyền dữ liệu
        res.render("client/pages/tour-list", {
            pageTitle: categoryDetail.name || "Danh sách tour",
            categoryDetail: categoryDetail,
            tourList: tourList
        });

    } catch (error) {
        console.error("Lỗi lấy danh sách tour:", error);
        res.redirect("/");
    }
};