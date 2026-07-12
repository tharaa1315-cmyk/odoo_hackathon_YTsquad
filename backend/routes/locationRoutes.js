const buildCrudRouter = require("./crudRouterFactory");
const locationController = require("../controllers/locationController");

module.exports = buildCrudRouter(locationController);
