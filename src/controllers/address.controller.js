const Address = require("../models/Address");

const createAddress = async (req, res) => {
    try {
        const address = await Address.create({
            ...req.body,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Address created successfully",
            data: address
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });

        res.json({
            success: true,
            data: addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateAddress = async (req, res) => {
    try {
        const address =
            await Address.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.user._id
                },
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.json({
            success: true,
            message: "Address updated",
            data: address
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const address =
            await Address.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.json({
            success: true,
            message: "Address deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createAddress, getAddresses, updateAddress, deleteAddress };