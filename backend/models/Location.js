const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ["branch", "warehouse", "floor", "room", "scrap", "other"],
      default: "other",
    },
    address: { type: String, default: "" },
    parentLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location", default: null },
    isScrapLocation: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
