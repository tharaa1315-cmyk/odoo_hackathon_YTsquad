const asyncHandler = require("express-async-handler");
const Asset = require("../models/Asset");
const Booking = require("../models/Booking");
const Maintenance = require("../models/Maintenance");
const Transfer = require("../models/Transfer");

exports.getDashboardStats = asyncHandler(async (req, res) => {
    const totalAssets = await Asset.countDocuments();
    const availableAssets = await Asset.countDocuments({ status: "available" });
    const allocatedAssets = await Asset.countDocuments({ status: "allocated" });
    const inMaintenanceAssets = await Asset.countDocuments({ status: "in_maintenance" });

    const activeBookings = await Booking.countDocuments({ status: { $in: ["upcoming", "ongoing"] } });

    const pendingMaintenance = await Maintenance.countDocuments({ status: "pending" });

    const pendingTransfers = await Transfer.countDocuments({ status: { $regex: /^pending/ } });

    // specific to user role if needed, but for now organization-wide stats
    res.json({
        success: true,
        data: {
            assets: {
                total: totalAssets,
                available: availableAssets,
                allocated: allocatedAssets,
                inMaintenance: inMaintenanceAssets,
            },
            bookings: {
                active: activeBookings,
            },
            maintenance: {
                pending: pendingMaintenance,
            },
            transfers: {
                pending: pendingTransfers,
            },
        },
    });
});

// A placeholder for CSV/Excel export which would typically pipe a stream
exports.exportReport = asyncHandler(async (req, res) => {
    res.json({ success: true, message: "Export functionality would stream a CSV/PDF here" });
});
