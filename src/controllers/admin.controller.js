const adminService =
    require("../services/admin.service");


const getDashboardStats = async (req, res) => {
    try {
        const data = await adminService.getDashboardStats();
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard"
        });
    }
};

module.exports = { getDashboardStats };