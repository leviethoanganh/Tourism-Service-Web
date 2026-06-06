const SettingWebsiteInfo = require("../../models/setting-website-infor.model");
const Category = require("../../models/category.model");
const City = require("../../models/city.model");
const { buildCategoryTree } = require("../../helpers/category.helper");

module.exports.websiteInfo = async (req, res) => {
    try {
        const websiteInfo = await SettingWebsiteInfo.findOne({});
        res.json({ code: "success", websiteInfo: websiteInfo || { websiteName: "Tourism Service" } });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
};

module.exports.categories = async (req, res) => {
    try {
        const categories = await Category.find({ deleted: false, status: "active" });
        const categoryList = buildCategoryTree(categories);
        res.json({ code: "success", categoryList });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
};

module.exports.cities = async (req, res) => {
    try {
        const cityList = await City.find({});
        res.json({ code: "success", cityList });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
};
