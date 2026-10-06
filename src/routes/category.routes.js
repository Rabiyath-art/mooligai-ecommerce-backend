// const express = require("express");

// const {
//     createCategory,
//     getCategories,
//     getCategoryById,
//     updateCategory,
//     deleteCategory,
//     getAdminCategories,
//     updateCategoryStatus
// } = require("../controllers/category.controller");

// const {
//     requireAdmin
// } = require("../middleware/admin.middleware");

// const router = express.Router();


// // =========================
// // PUBLIC
// // =========================

// // Get active categories
// router.get("/", getCategories);

// router.get("/admin/list", requireAdmin, getAdminCategories);

// // Get category by ID
// router.get("/:id", getCategoryById);

// // =========================
// // ADMIN
// // =========================

// // Create category
// router.post("/", requireAdmin, createCategory);

// // Update category
// router.put("/:id", requireAdmin, updateCategory);

// // =========================
// // ADMIN STATUS
// // =========================

// router.patch(
//     "/:id/status",
//     requireAdmin,
//     updateCategoryStatus
// );

// // Delete category
// router.delete(
//     "/:id",
//     requireAdmin,
//     deleteCategory
// );


// module.exports = router;

const express = require("express");

const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    updateCategoryStatus,
    getAdminCategories
} = require("../controllers/category.controller");

const {
    requireAdmin
} = require("../middleware/admin.middleware");

const router = express.Router();


// Get active categories
router.get("/", getCategories);


// =========================
// ADMIN
// =========================

// Get all categories for admin
router.get(
    "/admin/list",
    requireAdmin,
    getAdminCategories
);

// Create category
router.post(
    "/",
    requireAdmin,
    createCategory
);

// Update category
router.put(
    "/:id",
    requireAdmin,
    updateCategory
);

// Update category status
router.patch(
    "/:id/status",
    requireAdmin,
    updateCategoryStatus
);

// Soft delete category
router.delete(
    "/:id",
    requireAdmin,
    deleteCategory
);


// =========================
// PUBLIC DETAIL
// =========================

// Get category by ID
router.get(
    "/:id",
    getCategoryById
);

module.exports = router;