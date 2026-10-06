const crypto = require("crypto");

const razorpay = require("../config/razorpay");
const Order = require("../models/Order");

const createRazorpayOrder = async (userId, orderId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.payment.status === "paid") {
        throw new Error("Order is already paid");
    }

    const razorpayOrder =
        await razorpay.orders.create({
            amount: Math.round(
                order.totalAmount * 100
            ),
            currency: "INR",
            receipt: order._id.toString()
        });

    order.payment.razorpayOrderId =
        razorpayOrder.id;

    await order.save();

    return {
        order,
        razorpayOrder
    };
};

const verifyPayment = async ({
    userId,
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
}) => {
    const order = await Order.findOne({
        _id: orderId,
        user: userId
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (
        order.payment.razorpayOrderId !==
        razorpayOrderId
    ) {
        throw new Error(
            "Razorpay order ID does not match"
        );
    }

    const generatedSignature =
        crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpayOrderId}|${razorpayPaymentId}`
            )
            .digest("hex");

    if (generatedSignature !== razorpaySignature) {
        throw new Error(
            "Payment signature verification failed"
        );
    }

    order.payment.razorpayPaymentId =
        razorpayPaymentId;

    order.payment.razorpaySignature =
        razorpaySignature;

    order.payment.status = "paid";

    order.orderStatus = "confirmed";

    await order.save();

    return order;
};

module.exports = {
    createRazorpayOrder,
    verifyPayment
};