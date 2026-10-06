const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

const getWishlist = async (userId) => {
    let wishlist = await Wishlist.findOne({
        user: userId
    }).populate("products");

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: userId,
            products: []
        });
    }

    return wishlist;
};

const toggleWishlist = async (
    userId,
    productId
) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    let wishlist = await Wishlist.findOne({
        user: userId
    });

    if (!wishlist) {
        wishlist = new Wishlist({
            user: userId,
            products: []
        });
    }

    const index = wishlist.products.findIndex(
        id => id.toString() === productId
    );

    let message;

    if (index === -1) {
        wishlist.products.push(productId);
        message = "Added to wishlist";
    } else {
        wishlist.products.splice(index, 1);
        message = "Removed from wishlist";
    }

    await wishlist.save();

    await wishlist.populate("products");

    return {
        wishlist,
        message
    };
};

module.exports = {
    getWishlist,
    toggleWishlist
};