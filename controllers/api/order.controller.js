const Order = require("../../models/order.model");
const City = require("../../models/city.model");
const moment = require("moment");
const { paymentMethodList, paymentStatusList, statusList } = require("../../configs/variable.config");

module.exports.success = async (req, res) => {
    try {
        const { orderCode, phone } = req.query;

        const order = await Order.findOne({ code: orderCode, phone, deleted: false });
        if (!order) return res.status(404).json({ code: "error", message: "Order not found" });

        const method = paymentMethodList.find(i => i.value === order.paymentMethod);
        order.paymentMethodName = method ? method.label : order.paymentMethod;

        const payStatus = paymentStatusList.find(i => i.value === order.paymentStatus);
        order.paymentStatusName = payStatus ? payStatus.label : order.paymentStatus;

        const orderStatus = statusList.find(i => i.value === order.status);
        order.statusName = orderStatus ? orderStatus.label : order.status;

        order.createdAtFormat = moment(order.createdAt).format("HH:mm - DD/MM/YYYY");

        for (const item of order.items) {
            item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
            const city = await City.findOne({ _id: item.locationFrom });
            if (city) item.locationFromName = city.name;
        }

        res.json({ code: "success", order });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
};
