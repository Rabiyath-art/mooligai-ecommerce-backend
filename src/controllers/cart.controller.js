const cartService = require("../services/cart.service");

const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(
            req.user._id
        );

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const addToCart = async (req, res) => {
    try {
        const {
            productId,
            quantity
        } = req.body;

        const cart = await cartService.addToCart(
            req.user._id,
            productId,
            quantity
        );

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const {
            productId,
            quantity
        } = req.body;

        const cart = await cartService.updateCartItem(
            req.user._id,
            productId,
            quantity
        );

        res.status(200).json({
            success: true,
            message: "Cart updated",
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await cartService.removeFromCart(
            req.user._id,
            req.params.productId
        );

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const clearCart = async (req, res) => {
    try {
        await cartService.clearCart(
            req.user._id
        );

        res.status(200).json({
            success: true,
            message: "Cart cleared"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};