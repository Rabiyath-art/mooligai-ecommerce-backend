const wishlistService =
    require("../services/wishlist.service");

const getWishlist = async (req, res) => {
    try {
        const wishlist =
            await wishlistService.getWishlist(
                req.user._id
            );

        res.json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const toggleWishlist = async (req, res) => {
    try {
        const result =
            await wishlistService.toggleWishlist(
                req.user._id,
                req.body.productId
            );

        res.json({
            success: true,
            message: result.message,
            data: result.wishlist
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getWishlist,
    toggleWishlist
};