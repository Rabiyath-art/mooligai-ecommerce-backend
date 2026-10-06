const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const getDashboardStats = async () => {

    // Total products
    const totalProducts =
        await Product.countDocuments();


    // Total customers
    const totalCustomers =
        await User.countDocuments({
            role: "customer"
        });


    // Total orders
    const totalOrders =
        await Order.countDocuments();


    // Total sales
    const salesResult =
        await Order.aggregate([
            {
                $match: {
                    "payment.status": "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);


    const totalSales =
        salesResult.length > 0
            ? salesResult[0].totalSales
            : 0;


    // Recent orders
    const recentOrders =
        await Order.find()
            .populate(
                "user",
                "name email"
            )
            .sort({
                createdAt: -1
            })
            .limit(5)
            .lean();


    return {

        totalSales,

        totalOrders,

        totalProducts,

        totalCustomers,

        recentOrders

    };

};


module.exports = {
    getDashboardStats
};