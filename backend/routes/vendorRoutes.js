const buildCrudRouter = require("./crudRouterFactory");
const vendorController = require("../controllers/vendorController");

module.exports = buildCrudRouter(vendorController);
