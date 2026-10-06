const productService =
    require("../services/product.service");

const adminProductService =
    require("../services/admin-product.service");


// ========================================
// PUBLIC PRODUCTS
// ========================================

const getProducts = async (
    req,
    res
) => {

    try {

        const result =
            await productService.getProducts(
                req.query
            );


        res.status(200).json({

            success: true,

            data: result.products,

            pagination:
                result.pagination

        });

    } catch (error) {

        console.error(
            "Products error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// PUBLIC PRODUCT DETAIL
// ========================================

const getProductById = async (
    req,
    res
) => {

    try {

        const product =
            await productService.getProductById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }


        res.status(200).json({

            success: true,

            data: product

        });

    } catch (error) {

        console.error(
            "Product detail error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// ADMIN PRODUCT LIST
// ========================================

const getAdminProducts = async (
    req,
    res
) => {

    try {

        const result =
            await adminProductService
                .getAdminProducts(
                    req.query
                );


        res.status(200).json({

            success: true,

            data: result.products,

            pagination:
                result.pagination

        });

    } catch (error) {

        console.error(
            "Admin products error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// ADMIN PRODUCT DETAIL
// ========================================

const getAdminProductById = async (
    req,
    res
) => {

    try {

        const product =
            await adminProductService
                .getAdminProductById(
                    req.params.id
                );


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }


        res.status(200).json({

            success: true,

            data: product

        });

    } catch (error) {

        console.error(
            "Admin product detail error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// CREATE PRODUCT
// ========================================

const createProduct = async (
    req,
    res
) => {

    try {

        const data = {
            ...req.body
        };


        // ========================================
        // IMAGES
        // ========================================

        if (
            req.files &&
            req.files.length > 0
        ) {

            data.images =
                req.files.map(
                    file =>
                        `${req.protocol}://${req.get("host")}/uploads/products/${file.filename}`
                );

        } else {

            data.images = [];

        }


        // ========================================
        // INGREDIENTS
        // ========================================

        if (
            typeof data.ingredients === "string"
        ) {

            try {

                data.ingredients =
                    JSON.parse(
                        data.ingredients
                    );

            } catch {

                data.ingredients =
                    data.ingredients
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean);

            }

        }


        const product =
            await productService.createProduct(
                data
            );


        res.status(201).json({

            success: true,

            message:
                "Product created successfully",

            data: product

        });

    } catch (error) {

        console.error(
            "Create product error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (
    req,
    res
) => {

    try {

        const data = {
            ...req.body
        };


        // ========================================
        // INGREDIENTS
        // ========================================

        if (
            typeof data.ingredients === "string"
        ) {

            try {

                data.ingredients =
                    JSON.parse(
                        data.ingredients
                    );

            } catch {

                data.ingredients =
                    data.ingredients
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean);

            }

        }


        // ========================================
        // NEW IMAGES
        // ========================================

        if (
            req.files &&
            req.files.length > 0
        ) {

            data.images =
                req.files.map(
                    file =>
                        `${req.protocol}://${req.get("host")}/uploads/products/${file.filename}`
                );

        }


        const product =
            await productService.updateProduct(
                req.params.id,
                data
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Product updated successfully",

            data: product

        });

    } catch (error) {

        console.error(
            "Update product error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (
    req,
    res
) => {

    try {

        const product =
            await productService.deleteProduct(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Product deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// UPDATE STATUS
// ========================================

const updateProductStatus = async (
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
                    "isActive must be a boolean"

            });

        }


        const product =
            await adminProductService
                .updateProductStatus(
                    req.params.id,
                    isActive
                );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                isActive
                    ? "Product activated successfully"
                    : "Product deactivated successfully",

            data: product

        });

    } catch (error) {

        console.error(
            "Update product status error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ========================================
// UPLOAD PRODUCT IMAGES
// ========================================

const uploadProductImages = async (
    req,
    res
) => {

    try {

        if (
            !req.files ||
            req.files.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please select at least one image"

            });

        }


        const imageUrls =
            req.files.map(
                file =>
                    `${req.protocol}://${req.get("host")}/uploads/products/${file.filename}`
            );


        res.status(200).json({

            success: true,

            message:
                "Images uploaded successfully",

            data: {

                images: imageUrls

            }

        });

    } catch (error) {

        console.error(
            "Image upload error:",
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

    getProducts,
    getProductById,

    getAdminProducts,
    getAdminProductById,

    createProduct,
    updateProduct,
    deleteProduct,

    updateProductStatus,
    uploadProductImages
};