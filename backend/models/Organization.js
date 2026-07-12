const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Organization name is required"], trim: true },
    description: { type: String, trim: true },
    logo: { type: String, default: "" },
    organizationCode: {
      type: String,
      unique: true,
      required: true,
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", orgSchema);
