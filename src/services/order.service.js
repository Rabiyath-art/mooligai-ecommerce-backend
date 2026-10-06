const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Address = require("../models/Address");

const createOrder = async (
    userId,
    addressId
) => {

    const cart = await Cart.findOne({
        user: userId
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    const address = await Address.findOne({
        _id: addressId,
        user: userId
    });

    if (!address) {
        throw new Error("Address not found");
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of cart.items) {

        const product = item.product;

        if (!product || !product.isActive) {
            throw new Error(
                "One of the products is unavailable"
            );
        }

        if (product.stock < item.quantity) {
            throw new Error(
                `${product.name} does not have enough stock`
            );
        }

        const subtotal =
            product.price * item.quantity;

        totalAmount += subtotal;

        orderItems.push({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            subtotal
        });
    }


    // Reduce stock

    for (const item of cart.items) {

        await Product.findByIdAndUpdate(
            item.product._id,
            {
                $inc: {
                    stock: -item.quantity
                }
            }
        );

    }


    // Create MongoDB Order

    const order = await Order.create({
        user: userId,

        items: orderItems,

        shippingAddress: {
            name: address.name,
            phone: address.phone,
            addressLine1:
                address.addressLine1,
            addressLine2:
                address.addressLine2,
            city: address.city,
            state: address.state,
            pincode: address.pincode
        },

        totalAmount,

        payment: {
            provider: "razorpay",
            status: "pending"
        },

        orderStatus: "pending"
    });


    // Clear Cart

    await Cart.findOneAndUpdate(
        { user: userId },
        {
            $set: {
                items: []
            }
        }
    );


    return order;
};

const getMyOrders = async (userId) => {
    return await Order.find({
        user: userId
    })
        .populate("items.product")
        .sort({
            createdAt: -1
        });
};

const getOrderById = async (
    userId,
    orderId
) => {
    return await Order.findOne({
        _id: orderId,
        user: userId
    }).populate("items.product");
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
};