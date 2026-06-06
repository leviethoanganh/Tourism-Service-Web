const Tour = require("../../models/tour.model");
const Category = require("../../models/category.model");
const City = require("../../models/city.model");
const moment = require("moment");
const slugify = require("slugify");
const { getCategorySubId, buildCategoryTree } = require("../../helpers/category.helper");

const formatTour = (item) => {
    if (item.departureDate) {
        item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    }
    if (item.priceAdult > 0) {
        item.discount = Math.floor(((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100);
    }
    return item;
};

module.exports.home = async (req, res) => {
    try {
        const base = { deleted: false, status: "active" };

        const featured = await Tour.find(base).sort({ position: "desc" }).limit(6);
        featured.forEach(formatTour);

        const domesticCategoryId = "695134fefab9d9572656fcfa";
        const domesticSubIds = await getCategorySubId(domesticCategoryId);
        const domestic = await Tour.find({
            ...base,
            category: { $in: [domesticCategoryId, ...domesticSubIds] }
        }).sort({ position: "desc" }).limit(8);
        domestic.forEach(formatTour);

        const intlCategoryId = "69513531fab9d9572656fd02";
        const intlSubIds = await getCategorySubId(intlCategoryId);
        const international = await Tour.find({
            ...base,
            category: { $in: [intlCategoryId, ...intlSubIds] }
        }).sort({ position: "desc" }).limit(8);
        international.forEach(formatTour);

        res.json({ code: "success", featured, domestic, international });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
};

module.exports.list = async (req, res) => {
    try {
        const find = { deleted: false, status: "active" };

        if (req.query.category) {
            const cat = await Category.findOne({ slug: req.query.category, deleted: false });
            if (cat) {
                const subIds = await getCategorySubId(cat._id.toString());
                find.category = { $in: [cat._id.toString(), ...subIds] };
            }
        }
        if (req.query.keyword) find.name = new RegExp(req.query.keyword.trim(), "i");
        if (req.query.status) find.status = req.query.status;

        const priceRanges = {
            "under-1m": { $lt: 1000000 },
            "1m-2m": { $gte: 1000000, $lte: 2000000 },
            "2m-6m": { $gte: 2000000, $lte: 6000000 },
            "over-6m": { $gt: 6000000 }
        };
        if (req.query.priceRange && priceRanges[req.query.priceRange]) {
            find.priceNewAdult = priceRanges[req.query.priceRange];
        }

        const limitItems = 6;
        const page = parseInt(req.query.page) || 1;
        const totalRecord = await Tour.countDocuments(find);
        const totalPage = Math.ceil(totalRecord / limitItems);

        const tourList = await Tour.find(find)
            .sort({ position: "desc" })
            .limit(limitItems)
            .skip((page - 1) * limitItems);

        tourList.forEach(formatTour);

        res.json({
            code: "success",
            tourList,
            pagination: { currentPage: page, totalPage, totalRecord, limitItems }
        });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
};

module.exports.detail = async (req, res) => {
    try {
        const tour = await Tour.findOne({
            slug: req.params.slug,
            status: "active",
            deleted: false
        });

        if (!tour) return res.status(404).json({ code: "error", message: "Tour not found" });

        if (tour.departureDate) {
            tour.departureDateFormat = moment(tour.departureDate).format("DD/MM/YYYY");
        }

        if (tour.locations && tour.locations.length > 0) {
            tour.cityList = await City.find({ _id: { $in: tour.locations } });
        }

        const category = tour.category
            ? await Category.findOne({ _id: tour.category, deleted: false })
            : null;

        res.json({ code: "success", tour, category });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
};

module.exports.search = async (req, res) => {
    try {
        const find = { deleted: false, status: "active" };

        if (req.query.locationFrom) find.locations = req.query.locationFrom;

        if (req.query.locationTo) {
            const keyword = slugify(req.query.locationTo, { lower: true });
            find.slug = new RegExp(keyword, "i");
        }

        if (req.query.departureDate) find.departureDate = new Date(req.query.departureDate);
        if (req.query.stockAdult) find.stockAdult = { $gte: parseInt(req.query.stockAdult) };
        if (req.query.stockChildren) find.stockChildren = { $gte: parseInt(req.query.stockChildren) };
        if (req.query.stockBaby) find.stockBaby = { $gte: parseInt(req.query.stockBaby) };

        if (req.query.price) {
            const [min, max] = req.query.price.split("-");
            find.priceNewAdult = { $gte: parseInt(min), $lte: parseInt(max) };
        }

        const tourList = await Tour.find(find).sort({ position: "desc" });
        tourList.forEach(formatTour);

        res.json({ code: "success", tourList });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
};
