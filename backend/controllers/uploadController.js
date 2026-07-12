const asyncHandler = require("express-async-handler");

// @desc    Upload a single file (asset image or attachment), returns hosted URL
// @route   POST /api/upload
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  res.status(201).json({
    success: true,
    data: {
      url: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
    },
  });
});

module.exports = { uploadFile };
