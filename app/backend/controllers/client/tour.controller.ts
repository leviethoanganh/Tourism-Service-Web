import { Request, Response } from "express";
import moment from "moment";
import slugify from "slugify";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import City from "../../models/city.model";
import { getCategorySubId } from "../../helpers/category.helper";

const formatTour = (item: any) => {
  if (item.departureDate) {
    item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
  }
  if (item.priceAdult > 0) {
    item.discount = Math.floor(
      ((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100
    );
  }
  return item;
};

export const home = async (req: Request, res: Response): Promise<void> => {
  try {
    const base = { deleted: false, status: "active" };

    // Featured tours (tất cả tour active, sort theo position)
    const featuredDocs = await Tour.find(base).sort({ position: "desc" }).limit(6);
    const featured = featuredDocs.map((t) => { const o = t.toObject(); formatTour(o); return o; });

    // Tour trong nước - ID lấy từ project gốc
    const domesticCategoryId = "695134fefab9d9572656fcfa";
    const domesticSubIds = await getCategorySubId(domesticCategoryId);
    const domesticDocs = await Tour.find({
      ...base,
      category: { $in: [domesticCategoryId, ...domesticSubIds] },
    }).sort({ position: "desc" }).limit(8);
    const domestic = domesticDocs.map((t) => { const o = t.toObject(); formatTour(o); return o; });

    // Tour nước ngoài - ID lấy từ project gốc
    const intlCategoryId = "69513531fab9d9572656fd02";
    const intlSubIds = await getCategorySubId(intlCategoryId);
    const intlDocs = await Tour.find({
      ...base,
      category: { $in: [intlCategoryId, ...intlSubIds] },
    }).sort({ position: "desc" }).limit(8);
    const international = intlDocs.map((t) => { const o = t.toObject(); formatTour(o); return o; });

    res.json({ code: "success", featured, domestic, international });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const find: Record<string, any> = { deleted: false, status: "active" };

    // Category filter
    if (req.query.category) {
      const cat = await Category.findOne({ slug: req.query.category as string, deleted: false });
      if (cat) {
        const subIds = await getCategorySubId(cat._id.toString());
        find.category = { $in: [cat._id.toString(), ...subIds] };
      }
    }

    // Keyword search
    if (req.query.keyword) {
      find.name = new RegExp((req.query.keyword as string).trim(), "i");
    }

    // Departure city (locationFrom = city ID in locations array)
    if (req.query.locationFrom) {
      find.locations = req.query.locationFrom;
    }

    // Destination search (locationTo = city name, search in tour name)
    if (req.query.locationTo) {
      find.name = new RegExp((req.query.locationTo as string).trim(), "i");
    }

    // Departure date
    if (req.query.departureDate) {
      const d = new Date(req.query.departureDate as string);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      find.departureDate = { $gte: d, $lt: nextDay };
    }

    // Passenger availability
    if (req.query.stockAdult && parseInt(req.query.stockAdult as string) > 0) {
      find.stockAdult = { $gte: parseInt(req.query.stockAdult as string) };
    }
    if (req.query.stockChildren && parseInt(req.query.stockChildren as string) > 0) {
      find.stockChildren = { $gte: parseInt(req.query.stockChildren as string) };
    }
    if (req.query.stockBaby && parseInt(req.query.stockBaby as string) > 0) {
      find.stockBaby = { $gte: parseInt(req.query.stockBaby as string) };
    }

    // Price range: "min-max" format
    if (req.query.price) {
      const [min, max] = (req.query.price as string).split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        find.priceNewAdult = { $gte: min, $lte: max };
      }
    }

    // Sort
    const sortMap: Record<string, any> = {
      "price-asc":  { priceNewAdult: 1 },
      "price-desc": { priceNewAdult: -1 },
      "hot":        { position: -1 },
    };
    const sortBy = (req.query.sortBy as string) || "hot";
    const sortOption = sortMap[sortBy] || { position: -1 };

    const limitItems = 6;
    const page = parseInt(req.query.page as string) || 1;
    const totalRecord = await Tour.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);

    const tourList = await Tour.find(find)
      .sort(sortOption)
      .limit(limitItems)
      .skip((page - 1) * limitItems);

    const result = tourList.map((t) => { const o = t.toObject(); formatTour(o); return o; });

    res.json({
      code: "success",
      tourList: result,
      pagination: { currentPage: page, totalPage, totalRecord, limitItems },
    });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const detail = async (req: Request, res: Response): Promise<void> => {
  try {
    const tour = await Tour.findOne({
      slug: req.params.slug,
      status: "active",
      deleted: false,
    });

    if (!tour) {
      res.status(404).json({ code: "error", message: "Tour not found" });
      return;
    }

    const tourObj = tour.toObject() as any;

    if (tourObj.departureDate) {
      tourObj.departureDateFormat = moment(tourObj.departureDate).format("DD/MM/YYYY");
    }

    if (tourObj.locations && tourObj.locations.length > 0) {
      tourObj.cityList = await City.find({ _id: { $in: tourObj.locations } });
    }

    const category = tourObj.category
      ? await Category.findOne({ _id: tourObj.category, deleted: false })
      : null;

    res.json({ code: "success", tour: tourObj, category });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const find: Record<string, any> = { deleted: false, status: "active" };

    if (req.query.locationFrom) find.locations = req.query.locationFrom;

    if (req.query.locationTo) {
      const keyword = slugify(req.query.locationTo as string, { lower: true });
      find.slug = new RegExp(keyword, "i");
    }

    if (req.query.departureDate) find.departureDate = new Date(req.query.departureDate as string);
    if (req.query.stockAdult) find.stockAdult = { $gte: parseInt(req.query.stockAdult as string) };
    if (req.query.stockChildren) find.stockChildren = { $gte: parseInt(req.query.stockChildren as string) };
    if (req.query.stockBaby) find.stockBaby = { $gte: parseInt(req.query.stockBaby as string) };

    if (req.query.price) {
      const [min, max] = (req.query.price as string).split("-");
      find.priceNewAdult = { $gte: parseInt(min), $lte: parseInt(max) };
    }

    const tourList = await Tour.find(find).sort({ position: "desc" });
    const result = tourList.map((t) => { const o = t.toObject(); formatTour(o); return o; });

    res.json({ code: "success", tourList: result });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};
