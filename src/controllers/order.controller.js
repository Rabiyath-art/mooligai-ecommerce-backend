const orderService =
    require("../services/order.service");

const createOrder = async (req, res) => {
    try {
        const {
            addressId
        } = req.body;

        const order =
            await orderService.createOrder(
                req.user._id,
                addressId
            );

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders =
            await orderService.getMyOrders(
                req.user._id
            );

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order =
            await orderService.getOrderById(
                req.user._id,
                req.params.id
            );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
};