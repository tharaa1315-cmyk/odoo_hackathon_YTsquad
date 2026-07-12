const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true }, // The shared resource
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming",
        },
        notes: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
