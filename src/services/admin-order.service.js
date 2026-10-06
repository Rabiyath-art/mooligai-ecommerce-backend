const mongoose = require("mongoose");

const Order = require("../models/Order");


// ========================================
// ADMIN ORDER LIST
// ========================================

const getAdminOrders = async (query) => {

    const {
        search,
        paymentStatus,
        orderStatus,
        sort,
        page = 1,
        limit = 10
    } = query;


    const filter = {};


    // ========================================
    // PAYMENT STATUS
    // ========================================

    if (paymentStatus) {

        filter["payment.status"] =
            paymentStatus;

    }


    // ========================================
    // ORDER STATUS
    // ========================================

    if (orderStatus) {

        filter.orderStatus =
            orderStatus;

    }


    // ========================================
    // SEARCH
    // ========================================

    if (search) {

        const users = await require("../models/User")
            .find({
                $or: [
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
                ]
            })
            .select("_id")
            .lean();


        const userIds =
            users.map(
                user => user._id
            );


        const searchConditions = [
            {
                "shippingAddress.name": {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                "shippingAddress.phone": {
                    $regex: search,
                    $options: "i"
                }
            }
        ];


        if (userIds.length > 0) {

            searchConditions.push({
                user: {
                    $in: userIds
                }
            });

        }


        if (
            mongoose.Types.ObjectId.isValid(search)
        ) {

            searchConditions.push({
                _id: search
            });

        }


        filter.$or =
            searchConditions;

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


    if (sort === "amount_asc") {

        sortOption = {
            totalAmount: 1
        };

    }


    if (sort === "amount_desc") {

        sortOption = {
            totalAmount: -1
        };

    }


    // ========================================
    // QUERY
    // ========================================

    const [
        orders,
        total
    ] = await Promise.all([

        Order.find(filter)

            .populate(
                "user",
                "name email avatar"
            )
            .populate(
                "items.product",
                "name slug images weight"
            )

            .sort(sortOption)

            .skip(skip)

            .limit(itemsPerPage)

            .lean(),

        Order.countDocuments(filter)

    ]);


    return {

        orders,

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
// ADMIN ORDER DETAIL
// ========================================

const getAdminOrderById = async (
    id
) => {

    if (
        !mongoose.Types.ObjectId.isValid(id)
    ) {

        return null;

    }


    return await Order.findById(id)

        .populate(
            "user",
            "name email avatar provider"
        )

        .populate(
            "items.product",
            "name slug images weight"
        )

        .lean();

};


// ========================================
// UPDATE ORDER STATUS
// ========================================

const updateOrderStatus = async (
    id,
    orderStatus
) => {

    const allowedStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
    ];


    if (
        !allowedStatuses.includes(
            orderStatus
        )
    ) {

        throw new Error(
            "Invalid order status"
        );

    }


    const order =
        await Order.findById(id);


    if (!order) {

        return null;

    }


    // ========================================
    // PREVENT CHANGING DELIVERED
    // ========================================

    if (
        order.orderStatus === "delivered" &&
        orderStatus !== "delivered"
    ) {

        throw new Error(
            "Delivered order cannot be changed"
        );

    }


    // ========================================
    // PREVENT CHANGING CANCELLED
    // ========================================

    if (
        order.orderStatus === "cancelled" &&
        orderStatus !== "cancelled"
    ) {

        throw new Error(
            "Cancelled order cannot be changed"
        );

    }


    order.orderStatus =
        orderStatus;


    await order.save();


    return await Order.findById(id)

        .populate(
            "user",
            "name email avatar"
        )

        .populate(
            "items.product",
            "name slug images weight"
        );

};


module.exports = {

    getAdminOrders,

    getAdminOrderById,

    updateOrderStatus

};