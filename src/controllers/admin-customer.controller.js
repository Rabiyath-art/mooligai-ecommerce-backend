const adminCustomerService =
    require("../services/admin-customer.service");


// ========================================
// CUSTOMER LIST
// ========================================

const getAdminCustomers = async (
    req,
    res
) => {

    try {

        const result =
            await adminCustomerService
                .getAdminCustomers(
                    req.query
                );


        res.status(200).json({

            success: true,

            data: result.customers,

            pagination:
                result.pagination

        });

    } catch (error) {

        console.error(
            "Admin customers error:",
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
// CUSTOMER DETAIL
// ========================================

const getAdminCustomerById = async (
    req,
    res
) => {

    try {

        const result =
            await adminCustomerService
                .getAdminCustomerById(
                    req.params.id
                );


        if (!result) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found"

            });

        }


        res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        console.error(
            "Admin customer detail error:",
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
// UPDATE CUSTOMER STATUS
// ========================================

const updateCustomerStatus = async (
    req,
    res
) => {

    try {

        const {
            isActive
        } = req.body;


        if (
            typeof isActive !== "boolean"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "isActive must be true or false"

            });

        }


        const customer =
            await adminCustomerService
                .updateCustomerStatus(
                    req.params.id,
                    isActive
                );


        if (!customer) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found"

            });

        }


        res.status(200).json({

            success: true,

            message:
                "Customer status updated successfully",

            data: customer

        });

    } catch (error) {

        console.error(
            "Customer status error:",
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

    getAdminCustomers,

    getAdminCustomerById,

    updateCustomerStatus

};