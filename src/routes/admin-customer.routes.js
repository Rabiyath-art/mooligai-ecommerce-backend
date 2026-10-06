const express = require("express");

const {
    getAdminCustomers,
    getAdminCustomerById,
    updateCustomerStatus
} = require("../controllers/admin-customer.controller");

const {
    requireAdmin
} = require("../middleware/admin.middleware");

const router =
    express.Router();


router.use(requireAdmin);

// api list
// search api

// GET / api / admin / customers ? search = selva 
// GET /api/admin/customers?search=gmail.com

// active customer
// GET / api / admin / customers ? status = active

// inactive customer
// GET / api / admin / customers ? status = inactive

// customer detail
// GET /api/admin/customers/USER_ID

// Disable customer
// PATCH /api/admin/customers/USER_ID/status

// ========================================
// CUSTOMER LIST
// ========================================

router.get(
    "/",
    getAdminCustomers
);


// ========================================
// CUSTOMER STATUS
// ========================================

router.patch(
    "/:id/status",
    updateCustomerStatus
);


// ========================================
// CUSTOMER DETAIL
// ========================================

router.get(
    "/:id",
    getAdminCustomerById
);


module.exports = router;