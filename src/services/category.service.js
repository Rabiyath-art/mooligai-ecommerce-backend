const Category = require("../models/Category");

const createCategory = async (data) => {
    return await Category.create(data);
};


// for getting category details
const getCategories = async () => {
    return await Category.find({ isActive: true }).sort({ name: 1 });
};

// for admin get categories

const getAdminCategories = async (query) => {

    const {
        search,
        status,
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


    // Status
    if (status === "active") {

        filter.isActive = true;

    }


    if (status === "inactive") {

        filter.isActive = false;

    }


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


    const [
        categories,
        total
    ] = await Promise.all([

        Category.find(filter)
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(itemsPerPage)
            .lean(),

        Category.countDocuments(filter)

    ]);


    return {

        categories,

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

const getCategoryById = async (id) => {

    return await Category.findOne({
        _id: id,
        isActive: true
    });

};

const updateCategory = async (id, data) => {
    return await Category.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );
};

// only need soft delete 
const deleteCategory = async (id) => {

    return await Category.findByIdAndUpdate(
        id,
        {
            isActive: false
        },
        {
            new: true
        }
    );

};

const updateCategoryStatus = async (id, isActive) => {
    return await Category.findByIdAndUpdate(
        id,
        {
            isActive
        },
        {
            new: true,
            runValidators: true
        }
    );

};

module.exports = {
    createCategory,
    getCategories,
    getAdminCategories,
    getCategoryById,
    updateCategory,
    updateCategoryStatus,
    deleteCategory
};