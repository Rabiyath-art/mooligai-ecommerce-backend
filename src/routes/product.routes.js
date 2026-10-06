// const express = require("express");

// const {
//     createProduct,
//     getProducts,
//     getProductById,
//     updateProduct,
//     deleteProduct,
//     getAdminProducts,
//     uploadProductImages
// } = require("../controllers/product.controller");

// const {
//     requireAdmin
// } = require("../middleware/admin.middleware");

// const upload =
//     require("../middleware/upload.middleware");

// const router = express.Router();


// // admin route list
// // All products
// // GET /api/products/admin/list

// // admin create product
// // POST /api/products

// // Admin Update Product
// // PUT /api/products/:id

// // Activate / Deactivate Product
// // PUT /api/products/:id



// // active only
// // GET /api/products/admin/list?status=active

// // Inactive only
// // GET /api/products/admin/list?status=inactive



// // =========================
// // ADMIN LIST
// // =========================

// router.get(
//     "/admin/list",
//     requireAdmin,
//     getAdminProducts
// );

// router.post(
//     "/admin/upload-images",
//     requireAdmin,
//     upload.array(
//         "images",
//         5
//     ),
//     uploadProductImages
// );

// // =========================
// // PUBLIC
// // =========================

// router.get(
//     "/",
//     getProducts
// );

// router.get(
//     "/:id",
//     getProductById
// );


// // =========================
// // ADMIN WRITE
// // =========================

// router.post(
//     "/",
//     requireAdmin,
//     createProduct
// );

// router.put(
//     "/:id",
//     requireAdmin,
//     updateProduct
// );

// router.delete(
//     "/:id",
//     requireAdmin,
//     deleteProduct
// );

// module.exports = router;

const express = require("express");

const {
    getProducts,
    getProductById
} = require("../controllers/product.controller");

const router = express.Router();
// GET /api/products
// GET /api/products/:id

// ========================================
// PUBLIC PRODUCTS
// ========================================

// GET /api/products
router.get(
    "/",
    getProducts
);


// GET /api/products/:id
router.get(
    "/:id",
    getProductById
);


module.exports = router;