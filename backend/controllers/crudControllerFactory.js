const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");

/**
 * Builds a standard set of CRUD handlers for a simple reference model
 * (Category, Department, Vendor, Location, Employee).
 *
 * @param {mongoose.Model} Model
 * @param {string[]} searchFields - fields eligible for `?keyword=` text search
 * @param {object[]} populateFields - mongoose populate config
 */
const buildCrudController = (Model, searchFields = [], populateFields = []) => {
  const getAll = asyncHandler(async (req, res) => {
    const features = new ApiFeatures(Model.find().populate(populateFields), req.query, searchFields)
      .search()
      .filter()
      .sort();

    await features.paginate();
    const items = await features.query;

    res.json({ success: true, data: items, pagination: features.pagination });
  });

  const getOne = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id).populate(populateFields);
    if (!item) {
      res.status(404);
      throw new Error("Record not found");
    }
    res.json({ success: true, data: item });
  });

  const createOne = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  });

  const updateOne = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404);
      throw new Error("Record not found");
    }
    res.json({ success: true, data: item });
  });

  const deleteOne = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Record not found");
    }

    if ("isActive" in item.schema.paths) {
      item.isActive = false;
      await item.save();
    } else {
      await item.deleteOne();
    }

    res.json({ success: true, message: "Record removed" });
  });

  return { getAll, getOne, createOne, updateOne, deleteOne };
};

module.exports = buildCrudController;
