import { Response } from "express";
import moment from "moment";
import Order from "../../models/order.model";
import City from "../../models/city.model";
import { paymentMethodList, paymentStatusList, statusList } from "../../configs/variable.config";
import { AuthRequest } from "../../interfaces";

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const find: Record<string, any> = { deleted: false };

    if (req.query.status) find.status = req.query.status;
    if (req.query.paymentMethod) find.paymentMethod = req.query.paymentMethod;
    if (req.query.paymentStatus) find.paymentStatus = req.query.paymentStatus;

    const filterDate: Record<string, any> = {};
    if (req.query.startDate) filterDate.$gte = moment(req.query.startDate as string).startOf("day").toDate();
    if (req.query.endDate) filterDate.$lte = moment(req.query.endDate as string).endOf("day").toDate();
    if (Object.keys(filterDate).length > 0) find.createdAt = filterDate;

    if (req.query.keyword) {
      const regex = new RegExp((req.query.keyword as string).trim(), "i");
      find.$or = [{ fullName: regex }, { phone: regex }, { code: regex }];
    }

    const limitItems = 5;
    const page = parseInt(req.query.page as string) || 1;
    const totalRecord = await Order.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    const skip = (page - 1) * limitItems;

    const orderList = await Order.find(find)
      .sort({ createdAt: "desc" })
      .limit(limitItems)
      .skip(skip);

    const enriched = orderList.map((o) => {
      const obj = o.toObject() as any;
      const method = paymentMethodList.find((i) => i.value === obj.paymentMethod);
      obj.paymentMethodName = method ? method.label : obj.paymentMethod;
      const payStatus = paymentStatusList.find((i) => i.value === obj.paymentStatus);
      obj.paymentStatusName = payStatus ? payStatus.label : obj.paymentStatus;
      obj.statusDetail = statusList.find((i) => i.value === obj.status);
      obj.createdAtTime = moment(obj.createdAt).format("HH:mm");
      obj.createdAtDate = moment(obj.createdAt).format("DD/MM/YYYY");
      return obj;
    });

    res.json({
      code: "success",
      orderList: enriched,
      statusList,
      paymentMethodList,
      paymentStatusList,
      pagination: { currentPage: page, totalPage, totalRecord, limitItems, skip },
    });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const getDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderDetail = await Order.findOne({ _id: req.params.id, deleted: false });
    if (!orderDetail) {
      res.status(404).json({ code: "error", message: "Order not found!" });
      return;
    }

    const obj = orderDetail.toObject() as any;
    obj.createdAtFormat = moment(obj.createdAt).format("HH:mm - DD/MM/YYYY");

    for (const item of obj.items) {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
      const city = await City.findOne({ _id: item.locationFrom });
      if (city) item.locationFromName = city.name;
    }

    res.json({
      code: "success",
      orderDetail: obj,
      paymentMethodList,
      paymentStatusList,
      statusList,
    });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};

export const editPatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderDetail = await Order.findOne({ _id: req.params.id, deleted: false });
    if (!orderDetail) {
      res.json({ code: "error", message: "Order not found!" });
      return;
    }

    await Order.updateOne({ _id: req.params.id, deleted: false }, req.body);

    res.json({ code: "success", message: "Order updated successfully!" });
  } catch (error) {
    res.json({ code: "error", message: "Update failed!" });
  }
};
