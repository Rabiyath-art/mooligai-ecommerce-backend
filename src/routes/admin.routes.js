const express = require("express");
const { getDashboardStats } = require("../controllers/admin.controller");
const { requireAdmin } = require("../middleware/admin.middleware");

const router = express.Router();

router.use(requireAdmin);

router.get("/dashboard", getDashboardStats);

module.exports = router;