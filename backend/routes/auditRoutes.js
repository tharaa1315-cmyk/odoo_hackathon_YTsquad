const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getAllAudits, createAudit, getAuditById, updateAudit, deleteAudit } = require("../controllers/auditController");

const router = express.Router();
router.use(protect);

router.route("/")
    .get(getAllAudits)
    .post(authorize("administrator", "asset_manager"), createAudit);

router.route("/:id")
    .get(getAuditById)
    .put(authorize("administrator", "asset_manager"), updateAudit)
    .delete(authorize("administrator"), deleteAudit);

module.exports = router;
