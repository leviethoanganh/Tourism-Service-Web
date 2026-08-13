import { Response } from "express";
import moment from "moment";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import City from "../../models/city.model";
import AccountAdmin from "../../models/account-admin.model";
import { buildCategoryTree } from "../../helpers/category.helper";
import { AuthRequest } from "../../interfaces";

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const find: Record<string, any> = { deleted: false };

    if (req.query.status) find.status = req.query.status;
    if (req.query.createdBy) find.createdBy = req.query.createdBy;
    if (req.query.category) find.category = req.query.category;

    const filterDate: Record<string, any> = {};
    if (req.query.startDate) filterDate.$gte = moment(req.query.startDate as string).startOf("day").toDate();
    if (req.query.endDate) filterDate.$lte = moment(req.query.endDate as string).endOf("day").toDate();
    if (Object.keys(filterDate).length > 0) find.createdAt = filterDate;

    const priceRanges: Record<string, any> = {
      "under-1m": { $lt: 1000000 },
      "1m-2m": { $gte: 1000000, $lte: 2000000 },
      "2m-6m": { $gte: 2000000, $lte: 6000000 },
      "over-6m": { $gt: 6000000 },
    };
    if (req.query.priceRange && priceRanges[req.query.priceRange as string]) {
      find.priceNewAdult = priceRanges[req.query.priceRange as string];
    }

    if (req.query.keyword) find.name = new RegExp((req.query.keyword as string).trim(), "i");

    const limitItems = 6;
    const page = parseInt(req.query.page as string) || 1;
    const totalRecord = await Tour.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    const skip = (page - 1) * limitItems;

    const tourList = await Tour.find(find)
      .sort({ position: "desc" })
      .limit(limitItems)
      .skip(skip);

    const enriched = await Promise.all(
      tourList.map(async (item) => {
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
    const categoryList = await Category.find({ deleted: false }).select("id name");

    res.json({
      code: "success",
      tourList: enriched,
      accountAdminList,
      categoryList,
      pagination: { currentPage: page, totalPage, totalRecord, limitItems, skip },
    });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const getFormData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categoryList = await Category.find({ deleted: false });
    const categoryTree = buildCategoryTree(categoryList as any);
    const cityList = await City.find({});
    res.json({ code: "success", categoryList: categoryTree, cityList });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;
      if (files["avatar"]?.[0]) {
        req.body.avatar = files["avatar"][0].path;
      } else {
        req.body.avatar = "";
      }
      if (files["images"]?.length > 0) {
        req.body.images = files["images"].map((f) => f.path);
      } else {
        req.body.images = [];
      }
    }

    req.body.position = req.body.position
      ? parseInt(req.body.position)
      : ((await Tour.findOne({}).sort({ position: "desc" }))?.position ?? 0) + 1;

    req.body.priceAdult = parseInt(req.body.priceAdult) || 0;
    req.body.priceChildren = parseInt(req.body.priceChildren) || 0;
    req.body.priceBaby = parseInt(req.body.priceBaby) || 0;
    req.body.priceNewAdult = parseInt(req.body.priceNewAdult) || req.body.priceAdult;
    req.body.priceNewChildren = parseInt(req.body.priceNewChildren) || req.body.priceChildren;
    req.body.priceNewBaby = parseInt(req.body.priceNewBaby) || req.body.priceBaby;
    req.body.stockAdult = parseInt(req.body.stockAdult) || 0;
    req.body.stockChildren = parseInt(req.body.stockChildren) || 0;
    req.body.stockBaby = parseInt(req.body.stockBaby) || 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.createdBy = req.account!.id;

    const newRecord = new Tour(req.body);
    await newRecord.save();

    res.json({ code: "success", message: "Tour created successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Failed to create tour!" });
  }
};

export const getDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tour = await Tour.findOne({ _id: req.params.id, deleted: false });
    if (!tour) {
      res.status(404).json({ code: "error", message: "Tour not found!" });
      return;
    }

    const tourObj = tour.toObject() as any;
    if (tourObj.departureDate) {
      tourObj.departureDateFormat = moment(tourObj.departureDate).format("YYYY-MM-DD");
    }

    const categoryList = buildCategoryTree(
      (await Category.find({ deleted: false })) as any
    );
    const cityList = await City.find({});

    res.json({ code: "success", tour: tourObj, categoryList, cityList });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const editPatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tourDetail = await Tour.findOne({ _id: req.params.id, deleted: false });
    if (!tourDetail) {
      res.json({ code: "error", message: "Tour not found!" });
      return;
    }

    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;
      if (files["avatar"]?.[0]) {
        req.body.avatar = files["avatar"][0].path;
      }
      if (files["images"]?.length > 0) {
        req.body.images = files["images"].map((f) => f.path);
      }
    }

    req.body.position = req.body.position
      ? parseInt(req.body.position)
      : ((await Tour.findOne({ deleted: false }).sort({ position: "desc" }))?.position ?? 0) + 1;

    req.body.priceAdult = parseInt(req.body.priceAdult) || 0;
    req.body.priceChildren = parseInt(req.body.priceChildren) || 0;
    req.body.priceBaby = parseInt(req.body.priceBaby) || 0;
    req.body.priceNewAdult = parseInt(req.body.priceNewAdult) || req.body.priceAdult;
    req.body.priceNewChildren = parseInt(req.body.priceNewChildren) || req.body.priceChildren;
    req.body.priceNewBaby = parseInt(req.body.priceNewBaby) || req.body.priceBaby;
    req.body.stockAdult = parseInt(req.body.stockAdult) || 0;
    req.body.stockChildren = parseInt(req.body.stockChildren) || 0;
    req.body.stockBaby = parseInt(req.body.stockBaby) || 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.updatedBy = req.account!.id;

    await Tour.updateOne({ _id: req.params.id, deleted: false }, req.body);

    res.json({ code: "success", message: "Tour updated successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Failed to update tour!" });
  }
};

export const deletePatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tourDetail = await Tour.findOne({ _id: req.params.id, deleted: false });
    if (!tourDetail) {
      res.json({ code: "error", message: "Tour not found!" });
      return;
    }

    await Tour.updateOne(
      { _id: req.params.id, deleted: false },
      { deleted: true, deletedBy: req.account!.id, deletedAt: new Date() }
    );

    res.json({ code: "success", message: "Tour deleted successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Failed to delete tour!" });
  }
};

export const trash = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tourList = await Tour.find({ deleted: true }).sort({ deletedAt: "desc" });

    const enriched = await Promise.all(
      tourList.map(async (item) => {
        const obj = item.toObject() as any;
        if (obj.createdBy) {
          const acc = await AccountAdmin.findOne({ _id: obj.createdBy });
          if (acc) obj.createdByFullName = acc.fullName;
        }
        if (obj.deletedBy) {
          const acc = await AccountAdmin.findOne({ _id: obj.deletedBy });
          if (acc) obj.deletedByFullName = acc.fullName;
        }
        obj.createdAtFormat = moment(obj.createdAt).format("HH:mm - DD/MM/YYYY");
        obj.deletedAtFormat = moment(obj.deletedAt).format("HH:mm - DD/MM/YYYY");
        return obj;
      })
    );

    res.json({ code: "success", tourList: enriched });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const undoPatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tourDetail = await Tour.findOne({ _id: req.params.id, deleted: true });
    if (!tourDetail) {
      res.json({ code: "error", message: "Tour not found in trash!" });
      return;
    }

    await Tour.updateOne(
      { _id: req.params.id, deleted: true },
      { deleted: false, $unset: { deletedBy: "", deletedAt: "" } }
    );

    res.json({ code: "success", message: "Tour restored successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Failed to restore tour!" });
  }
};

export const destroyDel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tourDetail = await Tour.findOne({ _id: req.params.id, deleted: true });
    if (!tourDetail) {
      res.json({ code: "error", message: "Tour not found in trash!" });
      return;
    }

    await Tour.deleteOne({ _id: req.params.id, deleted: true });

    res.json({ code: "success", message: "Tour permanently deleted!" });
  } catch (error) {
    res.json({ code: "error", message: "Failed to permanently delete tour!" });
  }
};
