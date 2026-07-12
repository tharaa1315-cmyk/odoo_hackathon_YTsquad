const asyncHandler = require("express-async-handler");
const Maintenance = require("../models/Maintenance");
const ApiFeatures = require("../utils/apiFeatures");

exports.getAllMaintenance = asyncHandler(async (req, res) => {
    const query = Maintenance.find().populate("asset", "name assetId category").populate("requestedBy", "name email").populate("assignedTechnician", "name");
    const features = new ApiFeatures(query, req.query, ["issueDescription"]).search().filter().sort();
    await features.paginate();
    const tickets = await features.query;
    res.json({ success: true, data: tickets, pagination: features.pagination });
});

exports.createMaintenance = asyncHandler(async (req, res) => {
    req.body.requestedBy = req.user.id;
    const ticket = await Maintenance.create(req.body);
    res.status(201).json({ success: true, data: ticket });
});

exports.updateMaintenance = asyncHandler(async (req, res) => {
    let ticket = await Maintenance.findById(req.params.id);
    if (!ticket) { res.status(404); throw new Error("Maintenance ticket not found"); }

    if (req.body.status === "resolved" && ticket.status !== "resolved") {
        req.body.resolvedAt = Date.now();
    }

    ticket = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: ticket });
});

exports.deleteMaintenance = asyncHandler(async (req, res) => {
    const ticket = await Maintenance.findById(req.params.id);
    if (!ticket) { res.status(404); throw new Error("Maintenance ticket not found"); }
    await ticket.deleteOne();
    res.json({ success: true, message: "Maintenance ticket removed" });
});
