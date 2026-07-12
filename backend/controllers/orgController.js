const expressAsyncHandler = require("express-async-handler");
const Organization = require("../models/Organization");
const User = require("../models/User");
const crypto = require("crypto");

const createOrganization = expressAsyncHandler(async (req, res) => {
    const { name, description, logo } = req.body;
    if (!name) {
        res.status(400);
        throw new Error("Organization name is required");
    }

    // Check if user already in an org
    if (req.user.organization) {
        res.status(400);
        throw new Error("You are already part of an organization");
    }

    const organizationCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    const org = await Organization.create({
        name,
        description,
        logo,
        organizationCode,
        admin: req.user._id,
    });

    // Assign user to org and make them admin
    req.user.organization = org._id;
    req.user.role = "administrator";
    req.user.joinStatus = "approved";
    await req.user.save();

    res.status(201).json(org);
});

const joinOrganization = expressAsyncHandler(async (req, res) => {
    const { organizationCode } = req.body;

    if (req.user.organization) {
        res.status(400);
        throw new Error("You are already part of an organization");
    }

    const org = await Organization.findOne({ organizationCode });
    if (!org) {
        res.status(404);
        throw new Error("Organization not found or invalid code");
    }

    req.user.organization = org._id;
    req.user.joinStatus = "pending";
    req.user.role = "user";
    await req.user.save();

    res.status(200).json({ message: "Join request submitted successfully. Pending admin approval." });
});

// Admin Approval
const getPendingRequests = expressAsyncHandler(async (req, res) => {
    if (req.user.role !== "administrator") {
        res.status(403);
        throw new Error("Not authorized");
    }

    const users = await User.find({ organization: req.user.organization, joinStatus: "pending" }).select("-password");
    res.status(200).json(users);
});

const processRequest = expressAsyncHandler(async (req, res) => {
    if (req.user.role !== "administrator") {
        res.status(403);
        throw new Error("Not authorized");
    }

    const { userId, action, role } = req.body; // action: 'approve' or 'reject'
    const targetUser = await User.findById(userId);

    if (!targetUser || targetUser.organization.toString() !== req.user.organization.toString()) {
        res.status(404);
        throw new Error("User not found in your organization request list");
    }

    // Users must never assign roles to themselves.
    if (targetUser._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error("You cannot change your own role");
    }

    if (action === "approve") {
        if (!["employee", "department_manager", "asset_manager"].includes(role)) {
            res.status(400);
            throw new Error("Invalid role assigned");
        }
        targetUser.joinStatus = "approved";
        targetUser.role = role;
        await targetUser.save();
        res.status(200).json({ message: "User approved successfully." });
    } else if (action === "reject") {
        targetUser.joinStatus = "none";
        targetUser.organization = undefined;
        targetUser.role = "user";
        await targetUser.save();
        res.status(200).json({ message: "User rejected" });
    } else {
        res.status(400);
        throw new Error("Invalid action. Must be approve or reject");
    }
});

const getOrganizationDetails = expressAsyncHandler(async (req, res) => {
    if (!req.user.organization) {
        res.status(404);
        throw new Error("You are not part of an organization");
    }

    const org = await Organization.findById(req.user.organization);
    res.status(200).json(org);
});

module.exports = {
    createOrganization,
    joinOrganization,
    getPendingRequests,
    processRequest,
    getOrganizationDetails,
};
