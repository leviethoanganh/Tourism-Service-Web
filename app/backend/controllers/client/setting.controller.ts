import { Request, Response } from "express";
import SettingWebsiteInfo from "../../models/setting-website-info.model";
import Category from "../../models/category.model";
import City from "../../models/city.model";
import { buildCategoryTree } from "../../helpers/category.helper";

export const websiteInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const websiteInfo = await SettingWebsiteInfo.findOne({});
    res.json({
      code: "success",
      websiteInfo: websiteInfo || { websiteName: "Tourism Service" },
    });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const categories = async (req: Request, res: Response): Promise<void> => {
  try {
    const cats = await Category.find({ deleted: false, status: "active" });
    const categoryList = buildCategoryTree(cats as any);
    res.json({ code: "success", categoryList });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const cities = async (req: Request, res: Response): Promise<void> => {
  try {
    const cityList = await City.find({});
    res.json({ code: "success", cityList });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};
