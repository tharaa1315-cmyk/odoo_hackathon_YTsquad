const QRCode = require("qrcode");
const Asset = require("../models/Asset");

// Generates a QR code as a base64 data URL encoding a JSON payload for the asset
const generateAssetQRCode = async (assetId, name) => {
  const payload = JSON.stringify({ assetId, name });
  return QRCode.toDataURL(payload, { margin: 1, width: 300 });
};

// Generates the next sequential human-readable asset ID, e.g. AST-00001
const generateNextAssetId = async () => {
  const last = await Asset.findOne().sort({ createdAt: -1 }).select("assetId");
  let nextNumber = 1;

  if (last && last.assetId) {
    const match = last.assetId.match(/(\d+)$/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }

  return `AST-${String(nextNumber).padStart(5, "0")}`;
};

module.exports = { generateAssetQRCode, generateNextAssetId };
