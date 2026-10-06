
const express = require("express");

const {
    getAdminOrders,
    getAdminOrderById,
    updateOrderStatus
} = require("../controllers/admin-order.controller");

const {
    requireAdmin
} = require("../middleware/admin.middleware");

const router = express.Router();


// ========================================
// ALL ADMIN ORDER ROUTES
// ========================================

router.use(requireAdmin);


// ========================================
// ORDER LIST
// ========================================

// GET /api/admin/orders

router.get(
    "/",
    getAdminOrders
);


// ========================================
// ORDER STATUS
// ========================================

// PATCH /api/admin/orders/:id/status

router.patch(
    "/:id/status",
    updateOrderStatus
);


// ========================================
// ORDER DETAIL
// ========================================

// GET /api/admin/orders/:id

router.get(
    "/:id",
    getAdminOrderById
);


module.exports = router;