const express = require("express");

const {
    createPaymentOrder,
    verifyPayment
} = require("../controllers/payment.controller");

const {
    requireAuth
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.post(
    "/create-order",
    createPaymentOrder
);

router.post(
    "/verify",
    verifyPayment
);

module.exports = router;