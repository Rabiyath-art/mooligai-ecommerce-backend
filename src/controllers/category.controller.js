const categoryService = require("../services/category.service");

const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        }); 
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(
            req.params.id,
            req.body
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const updateCategoryStatus = async (
    req,
    res
) => {

    try {

        const {
            isActive
        } = req.body;


        if (
            typeof isActive !== "boolean"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "isActive must be true or false"

            });

        }


        const category =
            await categoryService
                .updateCategoryStatus(
                    req.params.id,
                    isActive
                );


        if (!category) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Category status updated successfully",

            data: category

        });

    } catch (error) {

        console.error(
            "Category status error:",
            error
        );


        res.status(400).json({

            success: false,

            message:
                error.message

        });

    }

};

const getAdminCategories = async (
    req,
    res
) => {

    try {

        const result =
            await categoryService
                .getAdminCategories(
                    req.query
                );


        res.status(200).json({

            success: true,

            data:
                result.categories,

            pagination:
                result.pagination

        });

    } catch (error) {

        console.error(
            "Admin categories error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    updateCategoryStatus,
    getAdminCategories,
    deleteCategory
};