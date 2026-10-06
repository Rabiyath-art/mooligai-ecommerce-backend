const express = require("express");

const {
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress
} = require("../controllers/address.controller");

const {
    requireAuth
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.post("/", createAddress);

router.get("/", getAddresses);

router.put(
    "/:id",
    updateAddress
);

router.delete(
    "/:id",
    deleteAddress
);

module.exports = router;