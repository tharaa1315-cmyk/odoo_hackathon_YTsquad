const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const ApiFeatures = require("../utils/apiFeatures");

exports.getAllBookings = asyncHandler(async (req, res) => {
    const query = Booking.find().populate("asset", "name category location").populate("user", "name email");
    const features = new ApiFeatures(query, req.query, ["title", "notes"]).search().filter().sort();
    await features.paginate();
    const bookings = await features.query;
    res.json({ success: true, data: bookings, pagination: features.pagination });
});

exports.getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user.id })
        .populate("asset", "name isShared")
        .sort("-createdAt");
    res.json({ success: true, data: bookings });
});

exports.createBooking = asyncHandler(async (req, res) => {
    req.body.user = req.user.id;
    // Basic conflict check
    const conflict = await Booking.findOne({
        asset: req.body.asset,
        status: { $in: ["upcoming", "ongoing"] },
        $or: [
            { startTime: { $lt: req.body.endTime, $gte: req.body.startTime } },
            { endTime: { $gt: req.body.startTime, $lte: req.body.endTime } }
        ]
    });
    if (conflict) {
        res.status(400);
        throw new Error("Asset is already booked during this time slot.");
    }
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, data: booking });
});

exports.updateBookingStatus = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) { res.status(404); throw new Error("Booking not found"); }

    booking.status = req.body.status || booking.status;
    await booking.save();
    res.json({ success: true, data: booking });
});

exports.deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) { res.status(404); throw new Error("Booking not found"); }
    if (booking.user.toString() !== req.user.id && req.user.role !== "administrator") {
        res.status(403); throw new Error("Not authorized");
    }
    await booking.deleteOne();
    res.json({ success: true, message: "Booking removed" });
});
