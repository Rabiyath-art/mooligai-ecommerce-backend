// const express = require("express");

// const {
//     getAdminProducts,
//     getAdminProductById,
//     createProduct,
//     updateProduct,
//     deleteProduct,
//     uploadProductImages,
//     updateProductStatus
// } = require("../controllers/product.controller");

// const {
//     requireAdmin
// } = require("../middleware/admin.middleware");

// const upload =
//     require("../middleware/upload.middleware");

// const router = express.Router();


// // ========================================
// // ADMIN AUTH
// // ========================================

// router.use(requireAdmin);


// // ========================================
// // PRODUCT LIST
// // GET /api/admin/products
// // ========================================

// router.get(
//     "/",
//     getAdminProducts
// );


// // ========================================
// // PRODUCT DETAIL
// // GET /api/admin/products/:id
// // ========================================

// router.get(
//     "/:id",
//     getAdminProductById
// );


// // ========================================
// // CREATE PRODUCT
// // POST /api/admin/products
// // ========================================

// router.post(
//     "/",
//     upload.array("images", 5),
//     createProduct
// );


// // ========================================
// // UPDATE PRODUCT
// // PUT /api/admin/products/:id
// // ========================================

// router.put(
//     "/:id",
//     upload.array("images", 5),
//     updateProduct
// );


// // ========================================
// // DELETE PRODUCT
// // DELETE /api/admin/products/:id
// // ========================================

// router.delete(
//     "/:id",
//     deleteProduct
// );


// // ========================================
// // UPDATE STATUS
// // PATCH /api/admin/products/:id/status
// // ========================================

// router.patch(
//     "/:id/status",
//     updateProductStatus
// );


// // ========================================
// // UPLOAD IMAGES
// // POST /api/admin/products/upload-images
// // ========================================

// router.post(
//     "/upload-images",
//     upload.array("images", 5),
//     uploadProductImages
// );


// module.exports = router;

const express = require("express");

const {
    getAdminProducts,
    getAdminProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    updateProductStatus
} = require("../controllers/product.controller");

const {
    requireAdmin
} = require("../middleware/admin.middleware");

const upload = require("../middleware/upload.middleware");

const router = express.Router();


// ========================================
// ADMIN AUTH
// ========================================

router.use(requireAdmin);


// ========================================
// PRODUCT LIST
// GET /api/admin/products
// ========================================

router.get(
    "/",
    getAdminProducts
);


// ========================================
// UPLOAD PRODUCT IMAGES
// IMPORTANT: BEFORE /:id
// POST /api/admin/products/upload-images
// ========================================

router.post(
    "/upload-images",
    upload.array("images", 5),
    uploadProductImages
);


// ========================================
// CREATE PRODUCT
// POST /api/admin/products
// ========================================

router.post(
    "/",
    upload.array("images", 5),
    createProduct
);

// router.post(
//     "/",
//     requireAdmin,
//     createProduct
// );



// ========================================
// UPDATE PRODUCT STATUS
// PATCH /api/admin/products/:id/status
// IMPORTANT: BEFORE /:id
// ========================================

router.patch(
    "/:id/status",
    updateProductStatus
);


// ========================================
// PRODUCT DETAIL
// GET /api/admin/products/:id
// ========================================

router.get(
    "/:id",
    getAdminProductById
);


// ========================================
// UPDATE PRODUCT
// PUT /api/admin/products/:id
// ========================================

router.put(
    "/:id",
    upload.array("images", 5),
    updateProduct
);


// ========================================
// DELETE PRODUCT
// DELETE /api/admin/products/:id
// ========================================

// router.put(
//     "/:id",
//     updateProduct
// );

router.delete(
    "/:id",
    deleteProduct
);


module.exports = router;