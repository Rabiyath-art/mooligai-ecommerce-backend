const paymentService =
    require("../services/payment.service");

const createPaymentOrder = async (
    req,
    res
) => {
    try {
        const {
            orderId
        } = req.body;

        const result =
            await paymentService.createRazorpayOrder(
                req.user._id,
                orderId
            );

        res.status(200).json({
            success: true,
            data: {
                orderId: result.order._id,
                razorpayOrderId:
                    result.razorpayOrder.id,
                amount:
                    result.razorpayOrder.amount,
                currency:
                    result.razorpayOrder.currency,

                key:
                    process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const verifyPayment = async (
    req,
    res
) => {
    try {
        const {
            orderId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = req.body;

        const order =
            await paymentService.verifyPayment({
                userId: req.user._id,
                orderId,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
            });

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment
};