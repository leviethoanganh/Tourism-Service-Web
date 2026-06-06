const Tour = require("../../models/tour.model");
const moment = require("moment");
const { getCategorySubId } = require("../../helpers/category.helper");

module.exports.list = async (req, res) => {
    // --- Section 2: Tour Nổi Bật ---
    const tourListSection2 = await Tour.find({
        deleted: false,
        status: "active"
    })
    .sort({ position: "desc" }) // Sắp xếp theo vị trí giảm dần
    .limit(6);

    for (const item of tourListSection2) {
        if (item.departureDate) {
            item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
        }
        // Tính % giảm giá nếu có giá cũ và giá mới
        if (item.priceAdult > 0) {
            item.discount = Math.floor(((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100);
        }
    }
    // --- End Section 2 ---

    // --- Section 4: Tour theo danh mục (Ví dụ: Tour Sapa) ---
    const categoryIdSection4 = "695134fefab9d9572656fcfa";
    const categorySubIdSection4 = await getCategorySubId(categoryIdSection4);

    const tourListSection4 = await Tour.find({
        category: { 
            $in: [categoryIdSection4, ...categorySubIdSection4] 
        },
        deleted: false,
        status: "active"
    })
    .sort({ position: "desc" })
    .limit(8); // Section 4 hiển thị 8 tour

    for (const item of tourListSection4) {
        if (item.departureDate) {
            item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
        }
        if (item.priceAdult > 0) {
            item.discount = Math.floor(((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100);
        }
    }
    // --- End Section 4 ---
    // --- Đoạn code in tên tour ra Terminal ---
    console.log("--- Danh sách tên các tour thuộc Section 4 ---");
    if (tourListSection4.length > 0) {
        tourListSection4.forEach((tour, index) => {
            console.log(`${index + 1}. ${tour.name}`);
        });
    } else {
        console.log("Không tìm thấy tour nào thuộc danh mục này.");
    }

    // --- Section 4: Tour theo danh mục (Ví dụ: Tour Sapa) ---
    const categoryIdSection6 = "69513531fab9d9572656fd02";
    const categorySubIdSection6 = await getCategorySubId(categoryIdSection6);

    const tourListSection6 = await Tour.find({
        category: { 
            $in: [categoryIdSection6, ...categorySubIdSection6] 
        },
        deleted: false,
        status: "active"
    })
    .sort({ position: "desc" })
    .limit(8); // Section 4 hiển thị 8 tour

    for (const item of tourListSection6) {
        if (item.departureDate) {
            item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
        }
        if (item.priceAdult > 0) {
            item.discount = Math.floor(((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100);
        }
    }
    res.render('client/pages/home', {
        pageTitle: "Home",
        tourListSection2: tourListSection2,
        tourListSection4: tourListSection4,
        tourListSection6: tourListSection6
    });
};