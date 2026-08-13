import { Request, Response } from "express";
import moment from "moment";
import Order from "../../models/order.model";
import Tour from "../../models/tour.model";
import City from "../../models/city.model";
import { generateRandomNumber } from "../../helpers/generate.helper";
import {
  paymentMethodList,
  paymentStatusList,
  statusList,
} from "../../configs/variable.config";

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, phone, note, paymentMethod, items } = req.body;

    const orderCode = "OD" + generateRandomNumber(10);

    for (const item of items) {
      const tourDetail = await Tour.findOne({
        _id: item.tourId,
        deleted: false,
        status: "active",
      });

      if (!tourDetail) {
        res.json({
          code: "error",
          message: `Tour ID ${item.tourId} does not exist or unavailable. Please review your cart!`,
        });
        return;
      }

      item.priceNewAdult = tourDetail.priceNewAdult;
      item.priceNewChildren = tourDetail.priceNewChildren;
      item.priceNewBaby = tourDetail.priceNewBaby;
      item.departureDate = tourDetail.departureDate;
      item.name = tourDetail.name;
      item.avatar = tourDetail.avatar;
    }

    let subTotal = 0;
    const discount = 0;

    for (const item of items) {
      subTotal +=
        item.priceNewAdult * item.quantityAdult +
        item.priceNewChildren * item.quantityChildren +
        item.priceNewBaby * item.quantityBaby;
    }

    const total = subTotal - discount;

    const newRecord = new Order({
      code: orderCode,
      fullName,
      phone,
      note,
      items,
      subTotal,
      discount,
      total,
      paymentMethod,
      paymentStatus: "unpaid",
      status: "initial",
    });

    await newRecord.save();

    for (const item of items) {
      const tourDetail = await Tour.findOne({
        _id: item.tourId,
        deleted: false,
        status: "active",
      });
      if (tourDetail) {
        tourDetail.stockAdult = (tourDetail.stockAdult || 0) - item.quantityAdult;
        tourDetail.stockChildren = (tourDetail.stockChildren || 0) - item.quantityChildren;
        tourDetail.stockBaby = (tourDetail.stockBaby || 0) - item.quantityBaby;
        await tourDetail.save();
      }
    }

    res.json({
      code: "success",
      message: "Order placed successfully!",
      orderCode,
      orderId: newRecord.id,
    });
  } catch (error) {
    res.json({ code: "error", message: "Order failed! Please try again later." });
  }
};

export const success = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderCode, phone } = req.query as { orderCode: string; phone: string };

    const order = await Order.findOne({ code: orderCode, phone, deleted: false });
    if (!order) {
      res.status(404).json({ code: "error", message: "Order not found" });
      return;
    }

    const orderObj = order.toObject() as any;

    const method = paymentMethodList.find((i) => i.value === orderObj.paymentMethod);
    orderObj.paymentMethodName = method ? method.label : orderObj.paymentMethod;

    const payStatus = paymentStatusList.find((i) => i.value === orderObj.paymentStatus);
    orderObj.paymentStatusName = payStatus ? payStatus.label : orderObj.paymentStatus;

    const orderStatus = statusList.find((i) => i.value === orderObj.status);
    orderObj.statusName = orderStatus ? orderStatus.label : orderObj.status;

    orderObj.createdAtFormat = moment(orderObj.createdAt).format("HH:mm - DD/MM/YYYY");

    for (const item of orderObj.items) {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
      const city = await City.findOne({ _id: item.locationFrom });
      if (city) item.locationFromName = city.name;
    }

    res.json({ code: "success", order: orderObj });
  } catch (error: any) {
    res.status(500).json({ code: "error", message: error.message });
  }
};
