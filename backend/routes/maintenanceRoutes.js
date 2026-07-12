const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getAllMaintenance, createMaintenance, updateMaintenance, deleteMaintenance } = require("../controllers/maintenanceController");

const router = express.Router();
router.use(protect);

router.route("/")
    .get(getAllMaintenance)
    .post(createMaintenance);

router.route("/:id")
    .put(authorize("administrator", "asset_manager"), updateMaintenance)
    .delete(authorize("administrator"), deleteMaintenance);

module.exports = router;
