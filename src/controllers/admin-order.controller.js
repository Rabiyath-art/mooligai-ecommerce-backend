
const adminOrderService =
    require("../services/admin-order.service");


// ========================================
// GET ADMIN ORDERS
// ========================================

const getAdminOrders = async (
    req,
    res
) => {

    try {

        const result =
            await adminOrderService
                .getAdminOrders(
                    req.query
                );


        res.status(200).json({

            success: true,

            data: result.orders,

            pagination:
                result.pagination

        });

    } catch (error) {

        console.error(
            "Admin orders error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ========================================
// GET ADMIN ORDER DETAIL
// ========================================

const getAdminOrderById = async (
    req,
    res
) => {

    try {

        const order =
            await adminOrderService
                .getAdminOrderById(
                    req.params.id
                );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });

        }


        res.status(200).json({

            success: true,

            data: order

        });

    } catch (error) {

        console.error(
            "Admin order detail error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ========================================
// UPDATE ORDER STATUS
// ========================================

const updateOrderStatus = async (
    req,
    res
) => {

    try {

        const {
            orderStatus
        } = req.body;


        if (!orderStatus) {

            return res.status(400).json({

                success: false,

                message:
                    "orderStatus is required"

            });

        }


        const order =
            await adminOrderService
                .updateOrderStatus(
                    req.params.id,
                    orderStatus
                );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Order status updated successfully",

            data: order

        });

    } catch (error) {

        console.error(
            "Update order status error:",
            error
        );


        res.status(400).json({

            success: false,

            message:
                error.message

        });

    }

};


module.exports = {

    getAdminOrders,

    getAdminOrderById,

    updateOrderStatus

};