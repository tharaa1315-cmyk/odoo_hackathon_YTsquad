const express = require("express");
const { protect } = require("../middleware/auth");
const { getDashboardStats, exportReport } = require("../controllers/analyticsController");

const router = express.Router();
router.use(protect);

router.get("/dashboard", getDashboardStats);
router.get("/export", exportReport);

module.exports = router;
