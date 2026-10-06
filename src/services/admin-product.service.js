const mongoose = require("mongoose");
const Product = require("../models/Product");


// ========================================
// GET ADMIN PRODUCTS
// ========================================

const getAdminProducts = async (query) => {

    const {
        search,
        category,
        status,
        stock,
        page = 1,
        limit = 10,
        sort
    } = query;


    const filter = {};


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
                slug: {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }


    // ========================================
    // CATEGORY
    // ========================================

    if (category) {

        if (
            mongoose.Types.ObjectId.isValid(category)
        ) {

            filter.category = category;

        }

    }


    // ========================================
    // STATUS
    // ========================================

    if (status === "active") {

        filter.isActive = true;

    }

    if (status === "inactive") {

        filter.isActive = false;

    }


    // ========================================
    // STOCK
    // ========================================

    if (stock === "out") {

        filter.stock = 0;

    }

    if (stock === "low") {

        filter.stock = {
            $gt: 0,
            $lte: 10
        };

    }

    if (stock === "available") {

        filter.stock = {
            $gt: 0
        };

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

    if (sort === "price_asc") {

        sortOption = {
            price: 1
        };

    }

    if (sort === "price_desc") {

        sortOption = {
            price: -1
        };

    }

    if (sort === "stock_asc") {

        sortOption = {
            stock: 1
        };

    }

    if (sort === "stock_desc") {

        sortOption = {
            stock: -1
        };

    }


    // ========================================
    // DATABASE
    // ========================================

    const [
        products,
        total
    ] = await Promise.all([

        Product.find(filter)

            .populate(
                "category",
                "name slug"
            )

            .sort(sortOption)

            .skip(skip)

            .limit(itemsPerPage)

            .lean(),

        Product.countDocuments(filter)

    ]);


    return {

        products,

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
// GET ADMIN PRODUCT BY ID
// ========================================

const getAdminProductById = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    return await Product.findById(id)
        .populate("category", "name slug")
        .lean();
};

// ========================================
// UPDATE PRODUCT STATUS
// ========================================

const updateProductStatus = async (
    id,
    isActive
) => {

    if (
        !mongoose.Types.ObjectId.isValid(id)
    ) {

        return null;

    }


    return await Product.findByIdAndUpdate(

        id,

        {
            isActive
        },

        {
            new: true,
            runValidators: true
        }

    )

        .populate(
            "category",
            "name slug"
        )

        .lean();

};


module.exports = {
    getAdminProducts,
    getAdminProductById,
    updateProductStatus
};