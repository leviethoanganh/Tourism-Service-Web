import { Response } from "express";
import AccountAdmin from "../../models/account-admin.model";
import Order from "../../models/order.model";
import { AuthRequest } from "../../interfaces";

export const dashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalAdmin = await AccountAdmin.countDocuments({ deleted: false });
    const orderList = await Order.find({ deleted: false });
    const totalOrder = orderList.length;
    const totalRevenue = orderList.reduce((sum, item) => sum + ((item as any).total || 0), 0);

    res.json({
      code: "success",
      overview: { totalAdmin, totalOrder, totalRevenue },
    });
  } catch (error) {
    res.status(500).json({ code: "error", message: "Unable to load dashboard" });
  }
};

export const revenueChartPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentMonth, currentYear, previousMonth, previousYear, arrayDay } = req.body;

    const ordersCurrentMonth = await Order.find({
      deleted: false,
      createdAt: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1),
      },
    });

    const ordersPreviousMonth = await Order.find({
      deleted: false,
      createdAt: {
        $gte: new Date(previousYear, previousMonth - 1, 1),
        $lt: new Date(previousYear, previousMonth, 1),
      },
    });

    const dataMonthCurrent: number[] = [];
    const dataMonthPrevious: number[] = [];

    for (const day of arrayDay) {
      const revenueCurrent = ordersCurrentMonth
        .filter((o) => new Date((o as any).createdAt).getDate() === day)
        .reduce((sum, o) => sum + ((o as any).total || 0), 0);
      dataMonthCurrent.push(revenueCurrent);

      const revenuePrevious = ordersPreviousMonth
        .filter((o) => new Date((o as any).createdAt).getDate() === day)
        .reduce((sum, o) => sum + ((o as any).total || 0), 0);
      dataMonthPrevious.push(revenuePrevious);
    }

    res.json({ code: "success", dataMonthCurrent, dataMonthPrevious });
  } catch (error) {
    res.json({ code: "error", message: "Unable to retrieve revenue data" });
  }
};
