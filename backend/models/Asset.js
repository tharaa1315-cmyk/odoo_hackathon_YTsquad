const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    url: String,
    fileName: String,
    fileType: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const historyEntrySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "created",
        "updated",
        "allocated",
        "returned",
        "transferred",
        "maintenance",
        "scrapped",
        "note",
      ],
      required: true,
    },
    note: { type: String, default: "" },
    fromLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    toLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const assetSchema = new mongoose.Schema(
  {
    assetId: { type: String, required: true, unique: true, trim: true }, // human readable e.g. AST-00001
    name: { type: String, required: [true, "Asset name is required"], trim: true },
    image: { type: String, default: "" },
    qrCode: { type: String, default: "" }, // data URL / cloudinary URL of generated QR
    barcode: { type: String, default: "" }, // barcode value (often same as assetId/serial)

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String, default: "" },
    model: { type: String, default: "" },
    serialNumber: { type: String, default: "", trim: true },

    purchaseDate: { type: Date },
    purchaseCost: { type: Number, default: 0, min: 0 },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    warrantyExpiry: { type: Date },
    currentValue: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: ["available", "allocated", "in_maintenance", "requested", "scrapped", "lost"],
      default: "available",
    },

    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },

    description: { type: String, default: "" },
    attachments: [attachmentSchema],
    history: [historyEntrySchema],

    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

assetSchema.index({ name: "text", assetId: "text", serialNumber: "text", brand: "text", model: "text" });

// Depreciated current value convenience (straight-line, based on category depreciationRate)
assetSchema.methods.calculateDepreciatedValue = function (categoryDepreciationRate = 0) {
  if (!this.purchaseDate || !this.purchaseCost) return this.currentValue;
  const yearsOwned = (Date.now() - new Date(this.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
  const depreciated = this.purchaseCost * (1 - (categoryDepreciationRate / 100) * yearsOwned);
  return Math.max(0, Math.round(depreciated * 100) / 100);
};

module.exports = mongoose.model("Asset", assetSchema);
