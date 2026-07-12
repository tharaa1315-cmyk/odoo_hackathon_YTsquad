const express = require("express");
const { protect, authorize } = require("../middleware/auth");

/**
 * Builds a standard REST router for a simple reference resource.
 * Read access: any authenticated user.
 * Write access: restricted to the given roles (defaults to admin + asset manager).
 */
const buildCrudRouter = (controller, writeRoles = ["administrator", "asset_manager"]) => {
  const router = express.Router();

  router.use(protect);

  router
    .route("/")
    .get(controller.getAll)
    .post(authorize(...writeRoles), controller.createOne);

  router
    .route("/:id")
    .get(controller.getOne)
    .put(authorize(...writeRoles), controller.updateOne)
    .delete(authorize("administrator"), controller.deleteOne);

  return router;
};

module.exports = buildCrudRouter;
