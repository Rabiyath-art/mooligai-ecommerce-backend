const express = require("express");

const { getWishlist, toggleWishlist } = require("../controllers/wishlist.controller");

const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", getWishlist);

router.post("/toggle", toggleWishlist);

module.exports = router;