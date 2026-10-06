const mongoose = require("mongoose");

const User = require("../models/User");
const Order = require("../models/Order");


// ========================================
// CUSTOMER LIST
// ========================================

const getAdminCustomers = async (query) => {

    const {
        search,
        status,
        page = 1,
        limit = 10,
        sort
    } = query;


    const filter = {
        role: "customer"
    };


    // ========================================
    // SEARCH
    // ========================================

    if (search) {

        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                email: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];

    }


    // ========================================
    // STATUS
    // ========================================

    if (status === "active") {

        filter.isActive = {
            $ne: false
        };

    }


    if (status === "inactive") {

        filter.isActive = false;

    }


    // ========================================
    // PAGINATION
    // ========================================

    const currentPage =
        Math.max(
            Number(page) || 1,
            1
        );


    const itemsPerPage =
        Math.min(
            Math.max(
                Number(limit) || 10,
                1
            ),
            100
        );


    const skip =
        (currentPage - 1) *
        itemsPerPage;


    // ========================================
    // SORT
    // ========================================

    let sortOption = {
        createdAt: -1
    };


    if (sort === "oldest") {

        sortOption = {
            createdAt: 1
        };

    }


    if (sort === "name_asc") {

        sortOption = {
            name: 1
        };

    }


    if (sort === "name_desc") {

        sortOption = {
            name: -1
        };

    }


    // ========================================
    // GET CUSTOMERS
    // ========================================

    const [
        customers,
        total
    ] = await Promise.all([

        User.find(filter)
            .select(
                "name email avatar provider isActive createdAt"
            )
            .sort(sortOption)
            .skip(skip)
            .limit(itemsPerPage)
            .lean(),

        User.countDocuments(filter)

    ]);


    // ========================================
    // ORDER STATISTICS
    // ========================================

    const customerIds =
        customers.map(
            customer => customer._id
        );


    const orderStats =
        await Order.aggregate([

            {
                $match: {

                    user: {
                        $in: customerIds
                    },

                    "payment.status": "paid"

                }
            },

            {
                $group: {

                    _id: "$user",

                    orderCount: {
                        $sum: 1
                    },

                    totalSpent: {
                        $sum: "$totalAmount"
                    }

                }
            }

        ]);


    const statsMap =
        new Map(
            orderStats.map(
                item => [
                    item._id.toString(),
                    item
                ]
            )
        );


    const result =
        customers.map(
            customer => {

                const stats =
                    statsMap.get(
                        customer._id.toString()
                    );


                return {

                    ...customer,

                    orderCount:
                        stats?.orderCount || 0,

                    totalSpent:
                        stats?.totalSpent || 0

                };

            }
        );


    return {

        customers: result,

        pagination: {

            total,

            page: currentPage,

            limit: itemsPerPage,

            totalPages:
                Math.ceil(
                    total /
                    itemsPerPage
                )

        }

    };

};


// ========================================
// CUSTOMER DETAIL
// ========================================

const getAdminCustomerById = async (
    id
) => {

    if (
        !mongoose.Types.ObjectId.isValid(id)
    ) {

        return null;

    }


    const customer =
        await User.findOne({
            _id: id,
            role: "customer"
        })
        .select(
            "name email avatar provider isActive createdAt updatedAt"
        )
        .lean();


    if (!customer) {

        return null;

    }


    // ========================================
    // CUSTOMER ORDERS
    // ========================================

    const orders =
        await Order.find({
            user: id
        })
        .populate(
            "items.product",
            "name images weight"
        )
        .sort({
            createdAt: -1
        })
        .lean();


    // ========================================
    // ORDER STATISTICS
    // ========================================

    const paidOrders =
        orders.filter(
            order =>
                order.payment?.status === "paid"
        );


    const totalSpent =
        paidOrders.reduce(
            (total, order) =>
                total +
                order.totalAmount,
            0
        );


    return {

        customer,

        statistics: {

            totalOrders:
                orders.length,

            paidOrders:
                paidOrders.length,

            totalSpent

        },

        orders

    };

};


// ========================================
// UPDATE CUSTOMER STATUS
// ========================================

const updateCustomerStatus = async (
    id,
    isActive
) => {

    if (
        !mongoose.Types.ObjectId.isValid(id)
    ) {

        throw new Error(
            "Invalid customer ID"
        );

    }


    const customer =
        await User.findOne({
            _id: id,
            role: "customer"
        });


    if (!customer) {

        return null;

    }


    customer.isActive =
        Boolean(isActive);


    await customer.save();


    return await User.findById(
        customer._id
    )
    .select(
        "name email avatar provider role isActive createdAt"
    )
    .lean();

};


module.exports = {

    getAdminCustomers,

    getAdminCustomerById,

    updateCustomerStatus

};