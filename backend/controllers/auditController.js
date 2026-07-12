const asyncHandler = require("express-async-handler");
const Audit = require("../models/Audit");
const ApiFeatures = require("../utils/apiFeatures");

exports.getAllAudits = asyncHandler(async (req, res) => {
    const query = Audit.find().populate("department", "name").populate("assignedAuditor", "name email");
    const features = new ApiFeatures(query, req.query, ["title", "description"]).search().filter().sort();
    await features.paginate();
    const audits = await features.query;
    res.json({ success: true, data: audits, pagination: features.pagination });
});

exports.createAudit = asyncHandler(async (req, res) => {
    const audit = await Audit.create(req.body);
    res.status(201).json({ success: true, data: audit });
});

exports.getAuditById = asyncHandler(async (req, res) => {
    const audit = await Audit.findById(req.params.id).populate("department").populate("assignedAuditor").populate("assetsToVerify.asset", "name assetId category location status condition");
    if (!audit) { res.status(404); throw new Error("Audit not found"); }
    res.json({ success: true, data: audit });
});

exports.updateAudit = asyncHandler(async (req, res) => {
    let audit = await Audit.findById(req.params.id);
    if (!audit) { res.status(404); throw new Error("Audit not found"); }

    if (req.body.status === "completed" && audit.status !== "completed") {
        req.body.completedAt = Date.now();
    }

    audit = await Audit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: audit });
});

exports.deleteAudit = asyncHandler(async (req, res) => {
    const audit = await Audit.findById(req.params.id);
    if (!audit) { res.status(404); throw new Error("Audit not found"); }
    await audit.deleteOne();
    res.json({ success: true, message: "Audit removed" });
});
