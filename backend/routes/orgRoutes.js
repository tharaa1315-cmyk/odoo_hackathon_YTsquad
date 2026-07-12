const express = require("express");
const { protect } = require("../middleware/auth");
const {
    createOrganization,
    joinOrganization,
    getPendingRequests,
    processRequest,
    getOrganizationDetails,
} = require("../controllers/orgController");

const router = express.Router();

router.post("/create", protect, createOrganization);
router.post("/join", protect, joinOrganization);
router.get("/requests", protect, getPendingRequests);
router.post("/process", protect, processRequest);
router.get("/me", protect, getOrganizationDetails);

module.exports = router;
