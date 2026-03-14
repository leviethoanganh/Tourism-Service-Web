const Category = require("../../models/category.model");
const Tour = require("../../models/tour.model");
const  City  =  require ( "../../models/city.model" );
const  moment  =  require ( "moment" );


// [GET] /tours/detail/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;

    // Tìm thông tin tour dựa trên slug
    const tourDetail = await Tour.findOne({
        slug: slug,
        status: "active",
        deleted: false
    });

    // Nếu không tìm thấy tour, quay về trang chủ
    if (!tourDetail) {
        res.redirect("/");
        return;
    }

    // Tìm thông tin danh mục tương ứng của tour đó
    const categoryDetail = await Category.findOne({
        _id: tourDetail.category,
        deleted: false,
        status: "active"
    });

    if (tourDetail.departureDate) {
        // Định dạng ngày khởi hành bằng thư viện moment
        tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("DD/MM/YYYY");
    }

    if (tourDetail.locations) {
        // Truy vấn danh sách thành phố dựa trên mảng ID lưu trong tourDetail.locations
        // Giả sử Model của bạn là City và bạn đang dùng async/await
        tourDetail.cityList = await City.find({
            _id: { $in: tourDetail.locations }
        });
    }
    // --- THÊM DÒNG NÀY ĐỂ KIỂM TRA ---
    console.log("Danh sách thành phố lấy được:", tourDetail.cityList);

    // Hiển thị trang chi tiết tour
    res.render('client/pages/tour-detail', {
        pageTitle: tourDetail.name,
        tourDetail: tourDetail,
        categoryDetail: categoryDetail
    });
};