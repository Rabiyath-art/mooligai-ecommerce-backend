const Cart = require("../models/Cart");
const Product = require("../models/Product");

const populateCart = async (cart) => {
    return await cart.populate({
        path: "items.product",
        populate: {
            path: "category"
        }
    });
};


const formatCart = (cart) => {

    let totalItems = 0;
    let totalAmount = 0;

    const items = cart.items.map(item => {

        const price = item.product.price;

        const subtotal =
            price * item.quantity;

        totalItems += item.quantity;

        totalAmount += subtotal;

        return {
            product: item.product,
            quantity: item.quantity,
            price,
            subtotal
        };
    });

    return {
        _id: cart._id,
        user: cart.user,
        items,
        totalItems,
        totalAmount,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
    };
};


const getCart = async (userId) => {

    let cart = await Cart.findOne({
        user: userId
    });

    if (!cart) {

        cart = await Cart.create({
            user: userId,
            items: []
        });

    }

    await populateCart(cart);

    return formatCart(cart);
};


const addToCart = async (
    userId,
    productId,
    quantity = 1
) => {

    const product =
        await Product.findById(productId);

    if (!product || !product.isActive) {
        throw new Error("Product not found");
    }

    if (product.stock < quantity) {
        throw new Error("Insufficient stock");
    }

    let cart =
        await Cart.findOne({
            user: userId
        });

    if (!cart) {

        cart = new Cart({
            user: userId,
            items: []
        });

    }

    const existingItem =
        cart.items.find(
            item =>
                item.product.toString() === productId
        );

    if (existingItem) {

        const newQuantity =
            existingItem.quantity + quantity;

        if (newQuantity > product.stock) {
            throw new Error(
                "Requested quantity exceeds available stock"
            );
        }

        existingItem.quantity =
            newQuantity;

    } else {

        cart.items.push({
            product: productId,
            quantity
        });

    }

    await cart.save();

    await populateCart(cart);

    return formatCart(cart);
};


const updateCartItem = async (
    userId,
    productId,
    quantity
) => {

    const cart =
        await Cart.findOne({
            user: userId
        });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const product =
        await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    if (quantity > product.stock) {
        throw new Error(
            "Requested quantity exceeds available stock"
        );
    }

    const item =
        cart.items.find(
            item =>
                item.product.toString() === productId
        );

    if (!item) {
        throw new Error(
            "Product not found in cart"
        );
    }

    item.quantity = quantity;

    await cart.save();

    await populateCart(cart);

    return formatCart(cart);
};


const removeFromCart = async (
    userId,
    productId
) => {

    const cart =
        await Cart.findOne({
            user: userId
        });

    if (!cart) {
        throw new Error("Cart not found");
    }

    cart.items =
        cart.items.filter(
            item =>
                item.product.toString() !== productId
        );

    await cart.save();

    await populateCart(cart);

    return formatCart(cart);
};


const clearCart = async (userId) => {

    const cart =
        await Cart.findOne({
            user: userId
        });

    if (!cart) {
        return null;
    }

    cart.items = [];

    await cart.save();

    return formatCart(cart);
};


module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};