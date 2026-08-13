import { Response } from "express";
import moment from "moment";
import slugify from "slugify";
import Category from "../../models/category.model";
import AccountAdmin from "../../models/account-admin.model";
import { buildCategoryTree } from "../../helpers/category.helper";
import { AuthRequest } from "../../interfaces";

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const find: Record<string, any> = { deleted: false };

    if (req.query.status) find.status = req.query.status;
    if (req.query.createdBy) find.createdBy = req.query.createdBy;

    const filterDate: Record<string, any> = {};
    if (req.query.startDate) filterDate.$gte = moment(req.query.startDate as string).toDate();
    if (req.query.endDate) filterDate.$lte = moment(req.query.endDate as string).toDate();
    if (Object.keys(filterDate).length > 0) find.createdAt = filterDate;

    if (req.query.keyword) {
      const keywordSlug = slugify((req.query.keyword as string).trim(), { lower: true, locale: "vi" });
      find.slug = new RegExp(keywordSlug, "i");
    }

    const limitItems = 3;
    const page = parseInt(req.query.page as string) || 1;
    const totalRecord = await Category.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    const skip = (page - 1) * limitItems;

    const categoryList = await Category.find(find)
      .sort({ position: "desc" })
      .limit(limitItems)
      .skip(skip);

    const enriched = await Promise.all(
      categoryList.map(async (item) => {
        const obj = item.toObject() as any;
        if (obj.createdBy) {
          const acc = await AccountAdmin.findOne({ _id: obj.createdBy });
          if (acc) obj.createdByFullName = acc.fullName;
        }
        if (obj.updatedBy) {
          const acc = await AccountAdmin.findOne({ _id: obj.updatedBy });
          if (acc) obj.updatedByFullName = acc.fullName;
        }
        obj.createdAtFormat = moment(obj.createdAt).format("HH:mm - DD/MM/YYYY");
        obj.updatedAtFormat = moment(obj.updatedAt).format("HH:mm - DD/MM/YYYY");
        return obj;
      })
    );

    const accountAdminList = await AccountAdmin.find({ deleted: false }).select("id fullName");

    res.json({
      code: "success",
      categoryList: enriched,
      accountAdminList,
      pagination: { currentPage: page, totalPage, totalRecord, limitItems, skip },
    });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const getFormData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cats = await Category.find({ deleted: false });
    res.json({ code: "success", categoryList: buildCategoryTree(cats as any) });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.pers && !req.pers.includes("category-create")) {
      res.json({ code: "error", message: "Access denied!" });
      return;
    }

    if (req.file) req.body.avatar = req.file.path;
    else req.body.avatar = "";

    req.body.position = req.body.position
      ? parseInt(req.body.position)
      : ((await Category.findOne().sort({ position: "desc" }))?.position ?? 0) + 1;

    req.body.createdBy = req.account!.id;

    const newRecord = new Category(req.body);
    await newRecord.save();

    res.json({ code: "success", message: "Category created successfully!" });
  } catch (error: any) {
    res.json({ code: "error", message: "An error occurred!", error: error.message });
  }
};

export const getDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categoryDetail = await Category.findOne({ _id: req.params.id, deleted: false });
    if (!categoryDetail) {
      res.status(404).json({ code: "error", message: "Category not found!" });
      return;
    }
    const categoryList = buildCategoryTree(
      (await Category.find({ deleted: false })) as any
    );
    res.json({ code: "success", categoryDetail, categoryList });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const editPatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.pers && !req.pers.includes("category-edit")) {
      res.json({ code: "error", message: "Access denied!" });
      return;
    }

    const categoryDetail = await Category.findOne({ _id: req.params.id, deleted: false });
    if (!categoryDetail) {
      res.json({ code: "error", message: "Category not found!" });
      return;
    }

    const data: Record<string, any> = { ...req.body };
    if (req.file) data.avatar = req.file.path;

    data.position = data.position
      ? parseInt(data.position)
      : ((await Category.findOne({ deleted: false }).sort({ position: "desc" }))?.position ?? 0) + 1;

    data.updatedBy = req.account!.id;

    await Category.updateOne({ _id: req.params.id, deleted: false }, data);

    res.json({ code: "success", message: "Category updated successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "An error occurred while updating!" });
  }
};

export const deletePatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.pers && !req.pers.includes("category-delete")) {
      res.json({ code: "error", message: "Access denied!" });
      return;
    }

    const categoryDetail = await Category.findOne({ _id: req.params.id, deleted: false });
    if (!categoryDetail) {
      res.json({ code: "error", message: "Category not found!" });
      return;
    }

    await Category.updateOne(
      { _id: req.params.id, deleted: false },
      { deleted: true, deletedBy: req.account!.id, deletedAt: new Date() }
    );

    res.json({ code: "success", message: "Category deleted successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "An error occurred while deleting!" });
  }
};
