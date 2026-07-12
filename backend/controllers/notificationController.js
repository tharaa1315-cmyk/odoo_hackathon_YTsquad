const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

exports.getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id }).sort("-createdAt");
    res.json({ success: true, data: notifications });
});

exports.markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) { res.status(404); throw new Error("Notification not found"); }

    if (notification.user.toString() !== req.user.id) {
        res.status(403); throw new Error("Not authorized");
    }

    notification.isRead = true;
    await notification.save();
    res.json({ success: true, data: notification });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read" });
});
