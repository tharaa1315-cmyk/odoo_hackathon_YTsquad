const express = require("express");
const {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  scrapAsset,
  getAssetStats,
} = require("../controllers/assetController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/stats", getAssetStats);
router
  .route("/")
  .get(getAssets)
  .post(authorize("administrator", "asset_manager"), createAsset);

router
  .route("/:id")
  .get(getAsset)
  .put(authorize("administrator", "asset_manager"), updateAsset)
  .delete(authorize("administrator"), deleteAsset);

router.put("/:id/scrap", authorize("administrator", "asset_manager"), scrapAsset);

module.exports = router;
