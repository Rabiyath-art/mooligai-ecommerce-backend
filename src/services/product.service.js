const Product = require("../models/Product");

const createProduct = async (data) => {
    return await Product.create(data);
};

const getProducts = async (query) => {
    const {
        search,
        category,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 12
    } = query;

    const filter = {
        isActive: true
    };

    // Search
    if (search) {
        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    // Category
    if (category) {
        filter.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }

    // Pagination
    const currentPage = Number(page);
    const itemsPerPage = Number(limit);

    const skip = (currentPage - 1) * itemsPerPage;

    // Sorting
    let sortOption = {
        createdAt: -1
    };

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

    if (sort === "name_asc") {
        sortOption = {
            name: 1
        };
    }

    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate("category", "name slug")
            .sort(sortOption)
            .skip(skip)
            .limit(itemsPerPage),

        Product.countDocuments(filter)
    ]);

    return {
        products,
        pagination: {
            total,
            page: currentPage,
            limit: itemsPerPage,
            totalPages: Math.ceil(total / itemsPerPage)
        }
    };
};

const getProductById = async (id) => {
    return await Product.findById(id)
        .populate("category", "name slug");
};

const updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    ).populate("category", "name slug");
};

const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

// for admin purpose

const getAdminProducts = async (query) => {
    const {
        search,
        category,
        status,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 10
    } = query;

    const filter = {};

    // Search
    if (search) {
        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    // Category
    if (category) {
        filter.category = category;
    }

    // Status
    if (status === "active") {
        filter.isActive = true;
    }

    if (status === "inactive") {
        filter.isActive = false;
    }

    // Price range
    if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }

    // Pagination
    const currentPage = Math.max(
        Number(page) || 1,
        1
    );

    const itemsPerPage = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const skip =
        (currentPage - 1) *
        itemsPerPage;

    // Sorting
    let sortOption = {
        createdAt: -1
    };

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
            totalPages: Math.ceil(
                total / itemsPerPage
            )
        }
    };
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAdminProducts
};