const asyncHandler = require("express-async-handler");
const Transfer = require("../models/Transfer");
const Asset = require("../models/Asset");
const ApiFeatures = require("../utils/apiFeatures");

exports.getAllTransfers = asyncHandler(async (req, res) => {
    const query = Transfer.find()
        .populate("asset", "name assetId category")
        .populate("requestedBy", "name email")
        .populate("fromDepartment", "name")
        .populate("toDepartment", "name");
    const features = new ApiFeatures(query, req.query, ["reason"]).search().filter().sort();
    await features.paginate();
    const transfers = await features.query;
    res.json({ success: true, data: transfers, pagination: features.pagination });
});

exports.createTransfer = asyncHandler(async (req, res) => {
    req.body.requestedBy = req.user.id;
    const transfer = await Transfer.create(req.body);
    res.status(201).json({ success: true, data: transfer });
});

exports.updateTransferStatus = asyncHandler(async (req, res) => {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) { res.status(404); throw new Error("Transfer not found"); }

    const { status, step } = req.body;
    if (step === "dept_head") {
        transfer.deptHeadApproval = { status, date: Date.now(), by: req.user.id };
        transfer.status = status === 'approved' ? 'pending_asset_manager' : 'rejected';
    } else if (step === "asset_manager") {
        transfer.assetManagerApproval = { status, date: Date.now(), by: req.user.id };
        if (status === 'approved') {
            transfer.status = 'completed';
            // Allocate Asset to new department manually
            const asset = await Asset.findById(transfer.asset);
            if (asset) {
                asset.department = transfer.toDepartment;
                await asset.save();
            }
        } else {
            transfer.status = 'rejected';
        }
    } else {
        transfer.status = status;
    }

    await transfer.save();
    res.json({ success: true, data: transfer });
});

exports.deleteTransfer = asyncHandler(async (req, res) => {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) { res.status(404); throw new Error("Transfer not found"); }
    await transfer.deleteOne();
    res.json({ success: true, message: "Transfer request removed" });
});
