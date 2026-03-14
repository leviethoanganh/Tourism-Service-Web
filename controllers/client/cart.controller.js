const Tour = require('../../models/tour.model');
const City = require('../../models/city.model');
const moment = require('moment');

// [GET] /cart
module.exports.cart = (req, res) => {
    res.render('client/pages/cart', {
        pageTitle: "Giỏ hàng"
    });
};

// [POST] /cart/render
module.exports.render = async (req, res) => {
    try {
        const { cart } = req.body;
        const cartDetails = [];

        // --- Dòng in ra để kiểm tra dữ liệu gửi từ Frontend ---
        console.log("Dữ liệu giỏ hàng nhận được từ req.body:");
        console.log(JSON.stringify(cart, null, 2)); 
        // ------------------------------------------------------

        // Duyệt qua từng item trong giỏ hàng gửi từ localStorage lên
        for (const item of cart) {
            // 1. Tìm thông tin chi tiết Tour
            const tourDetail = await Tour.findOne({
                _id: item.tourId,
                status: "active",
                deleted: false
            });
            // 2. Kiểm tra và in thông tin tour tìm được từ Database
            if (tourDetail) {
                console.log("--- Đã tìm thấy thông tin Tour trong Database ---");
                console.log(`Tên Tour: ${tourDetail.name}`);
                console.log(`Giá: ${tourDetail.priceNewAdult}`);
                // Bạn có thể in toàn bộ object để xem các trường khác
                // console.log(tourDetail); 
            } else {
                console.log(`!!! Không tìm thấy Tour với ID: ${item.tourId}`);
            }

            // // 2. Tìm thông tin Thành phố khởi hành
            const cityDetail = await City.findOne({
                _id: item.locationFrom
            });

            if (tourDetail && cityDetail) {
                // 3. Kết hợp dữ liệu từ DB và dữ liệu từ giỏ hàng
                const cartItem = {
                    ...item,
                    avatar: tourDetail.avatar,
                    name: tourDetail.name,
                    slug: tourDetail.slug,
                    // Format ngày khởi hành bằng moment
                    departureDate: moment(tourDetail.departureDate).format("DD/MM/YYYY"),
                    locationFromName: cityDetail.name,
                    priceNewAdult: tourDetail.priceNewAdult,
                    priceNewChildren: tourDetail.priceNewChildren,
                    priceNewBaby: tourDetail.priceNewBaby,
                    stockAdult: tourDetail.stockAdult,
                    stockChildren: tourDetail.stockChildren,
                    stockBaby: tourDetail.stockBaby
                };

                cartDetails.push(cartItem);
            }
        }

        // 4. Trả về dữ liệu chi tiết cho Frontend
        res.json({
            code: "success",
            message: "Lấy dữ liệu giỏ hàng thành công!",
            cart: cartDetails
        });
    } catch (error) {
        res.json({
            code: "error",
            message: "Có lỗi xảy ra khi lấy dữ liệu giỏ hàng!"
        });
    }
};
