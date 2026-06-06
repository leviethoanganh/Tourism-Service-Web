module.exports.pathAdmin = "admin";

module.exports.permissionList = [
    {
        label: "View Dashboard",
        value: "dashboard-view"
    },
    {
        label: "View Categories",
        value: "category-view"
    },
    {
        label: "Create Category",
        value: "category-create"
    },
    {
        label: "Edit Category",
        value: "category-edit"
    },
    {
        label: "Delete Category",
        value: "category-delete"
    },
    {
        label: "View Tours",
        value: "tour-view"
    },
    {
        label: "Create Tour",
        value: "tour-create"
    },
    {
        label: "Edit Tour",
        value: "tour-edit"
    },
    {
        label: "Delete Tour",
        value: "tour-delete"
    },
    {
        label: "Tour Trash",
        value: "tour-trash"
    }
];


module.exports.paymentMethodList = [
    {
        label: "Cash",
        value: "money"
    },
    {
        label: "Bank Transfer",
        value: "bank"
    },
    {
        label: "VNPay",
        value: "vnpay"
    },
    {
        label: "ZaloPay",
        value: "zalopay"
    },
]

module.exports.paymentStatusList = [
    {
        label: "Unpaid",
        value: "unpaid"
    },
    {
        label: "Paid",
        value: "paid"
    },
]

module.exports.statusList = [
    {
        label: "Pending",
        value: "initial",
        color: "orange"
    },
    {
        label: "Completed",
        value: "done",
        color: "green"
    },
    {
        label: "Cancelled",
        value: "cancel",
        color: "red"
    },
]