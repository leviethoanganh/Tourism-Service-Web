const Tour = require("../../models/tour.model");
const moment = require("moment");
const slugify = require("slugify");

module.exports.list = async (req, res) => {
    try {
        const find = {
            status: "active",
            deleted: false
        };

        // 1. Điểm đi
        if (req.query.locationFrom) {
            find.locations = req.query.locationFrom;
        }

        // 2. Điểm đến (Sử dụng slug để tìm kiếm)
        if (req.query.locationTo) {
            const keyword = slugify(req.query.locationTo, {
                lower: true
            });
            const keywordRegex = new RegExp(keyword, "i"); // Thêm "i" để không phân biệt hoa thường
            find.slug = keywordRegex;
        }

        // 3. Ngày khởi hành
        if (req.query.departureDate) {
            find.departureDate = new Date(req.query.departureDate);
        }

        // 4. Số lượng hành khách (Sử dụng $gte: Greater Than or Equal)
        // Người lớn
        if (req.query.stockAdult) {
            find.stockAdult = {
                $gte: parseInt(req.query.stockAdult)
            };
        }
        // Trẻ em
        if (req.query.stockChildren) {
            find.stockChildren = {
                $gte: parseInt(req.query.stockChildren)
            };
        }
        // Em bé
        if (req.query.stockBaby) {
            find.stockBaby = {
                $gte: parseInt(req.query.stockBaby)
            };
        }

        // 5. Mức giá (Ví dụ format: 1000000-5000000)
        if (req.query.price) {
            const [priceMin, priceMax] = req.query.price.split("-");
            find.priceNewAdult = {
                $gte: parseInt(priceMin),
                $lte: parseInt(priceMax),
            };
        }

        // Truy vấn Database
        const tourList = await Tour.find(find).sort({
            position: "desc"
        });

        // Định dạng lại ngày hiển thị bằng Moment.js
        for (const item of tourList) {
            if (item.departureDate) {
                item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
            }
        }

        // Trả kết quả về giao diện
        res.render("client/pages/search", {
            pageTitle: "Kết quả tìm kiếm",
            tourList: tourList
        });

    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
};