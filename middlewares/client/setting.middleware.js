const SettingWebsiteInfo = require("../../models/setting-website-infor.model");

module.exports.websiteInfo = async (req, res, next) => {
    // Truy vấn bản ghi cấu hình website đầu tiên trong cơ sở dữ liệu
    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

    // Gán dữ liệu vào res.locals để tất cả các file Pug có thể truy cập
    res.locals.settingWebsiteInfo = settingWebsiteInfo;

    // Chuyển sang middleware hoặc controller tiếp theo
    next();
};