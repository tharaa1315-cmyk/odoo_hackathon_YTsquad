const asyncHandler = require("express-async-handler");
const Asset = require("../models/Asset");
const ApiFeatures = require("../utils/apiFeatures");
const { generateAssetQRCode, generateNextAssetId } = require("../utils/qrBarcode");

const populateFields = [
  { path: "category", select: "name code" },
  { path: "vendor", select: "name contactPerson" },
  { path: "location", select: "name type" },
  { path: "department", select: "name" },
  { path: "assignedEmployee", select: "name employeeId email" },
];

// @desc    Get all assets (search, filter, sort, paginate)
// @route   GET /api/assets
// @access  Private
const getAssets = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(
    Asset.find({ isActive: true }).populate(populateFields),
    req.query,
    ["name", "assetId", "serialNumber", "brand", "model"]
  )
    .search()
    .filter()
    .sort();

  await features.paginate();
  const assets = await features.query;

  res.json({ success: true, data: assets, pagination: features.pagination });
});

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Private
const getAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id)
    .populate(populateFields)
    .populate("history.performedBy", "name role")
    .populate("history.fromLocation history.toLocation", "name");

  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  res.json({ success: true, data: asset });
});

// @desc    Create asset
// @route   POST /api/assets
// @access  Private (administrator, asset_manager)
const createAsset = asyncHandler(async (req, res) => {
  const assetId = req.body.assetId || (await generateNextAssetId());
  const qrCode = await generateAssetQRCode(assetId, req.body.name);

  const asset = await Asset.create({
    ...req.body,
    assetId,
    qrCode,
    barcode: req.body.barcode || assetId,
    createdBy: req.user._id,
    history: [
      {
        action: "created",
        note: "Asset record created",
        toLocation: req.body.location,
        performedBy: req.user._id,
      },
    ],
  });

  const populated = await asset.populate(populateFields);
  res.status(201).json({ success: true, data: populated });
});

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private (administrator, asset_manager)
const updateAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  const previousLocation = asset.location;
  Object.assign(asset, req.body);

  asset.history.push({
    action: "updated",
    note: "Asset details updated",
    fromLocation: previousLocation,
    toLocation: asset.location,
    performedBy: req.user._id,
  });

  await asset.save();
  const populated = await asset.populate(populateFields);
  res.json({ success: true, data: populated });
});

// @desc    Delete (soft-delete) asset
// @route   DELETE /api/assets/:id
// @access  Private (administrator)
const deleteAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  asset.isActive = false;
  await asset.save();
  res.json({ success: true, message: "Asset removed" });
});

// @desc    Scrap an asset (moves to scrap status, keeps history forever)
// @route   PUT /api/assets/:id/scrap
// @access  Private (administrator, asset_manager)
const scrapAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }

  asset.status = "scrapped";
  asset.history.push({
    action: "scrapped",
    note: req.body.note || "Asset scrapped",
    performedBy: req.user._id,
  });

  await asset.save();
  res.json({ success: true, data: asset });
});

// @desc    Asset stats for dashboards
// @route   GET /api/assets/stats
// @access  Private
const getAssetStats = asyncHandler(async (req, res) => {
  const [byStatus, totalValue, total, warrantyExpiringSoon] = await Promise.all([
    Asset.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Asset.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: "$currentValue" } } },
    ]),
    Asset.countDocuments({ isActive: true }),
    Asset.countDocuments({
      isActive: true,
      warrantyExpiry: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      total,
      totalValue: totalValue[0]?.total || 0,
      byStatus,
      warrantyExpiringSoon,
    },
  });
});

module.exports = {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  scrapAsset,
  getAssetStats,
};
