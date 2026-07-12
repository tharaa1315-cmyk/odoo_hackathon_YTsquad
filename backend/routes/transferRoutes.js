const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getAllTransfers, createTransfer, updateTransferStatus, deleteTransfer } = require("../controllers/transferController");

const router = express.Router();
router.use(protect);

router.route("/")
    .get(getAllTransfers)
    .post(createTransfer);

router.route("/:id")
    .put(authorize("administrator", "asset_manager", "department_manager"), updateTransferStatus)
    .delete(authorize("administrator"), deleteTransfer);

module.exports = router;
