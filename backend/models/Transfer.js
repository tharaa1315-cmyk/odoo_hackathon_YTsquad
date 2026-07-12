const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fromDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    toDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending_dept_head", "pending_asset_manager", "approved", "rejected", "completed"],
      default: "pending_dept_head",
    },
    deptHeadApproval: {
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      date: { type: Date },
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    assetManagerApproval: {
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      date: { type: Date },
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transfer", transferSchema);
