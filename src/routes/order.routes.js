const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById
} = require("../controllers/order.controller");

const {
    requireAuth
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.post("/", createOrder);

router.get(
    "/my-orders",
    getMyOrders
);

router.get(
    "/:id",
    getOrderById
);

module.exports = router;