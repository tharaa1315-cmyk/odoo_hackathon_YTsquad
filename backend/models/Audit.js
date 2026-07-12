const mongoose = require("mongoose");

const assetVerificationSchema = new mongoose.Schema(
    {
        asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
        status: { type: String, enum: ["verified", "missing", "damaged", "pending"], default: "pending" },
        notes: { type: String, default: "" },
    },
    { _id: false }
);

const auditSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }, // Optional: If audit is scoped to a dept
        assignedAuditor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["open", "in_progress", "completed", "cancelled"],
            default: "open",
        },
        assetsToVerify: [assetVerificationSchema],
        completedAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Audit", auditSchema);
