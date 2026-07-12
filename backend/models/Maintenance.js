const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
    {
        asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        issueDescription: { type: String, required: true },
        priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
        status: {
            type: String,
            enum: ["pending", "approved", "in_progress", "resolved", "rejected"],
            default: "pending",
        },
        assignedTechnician: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        photos: [{ url: String, fileName: String }],
        resolutionNotes: { type: String, default: "" },
        resolvedAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
