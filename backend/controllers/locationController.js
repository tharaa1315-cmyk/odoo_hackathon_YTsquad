const Location = require("../models/Location");
const buildCrudController = require("./crudControllerFactory");

module.exports = buildCrudController(Location, ["name", "address"], [{ path: "parentLocation", select: "name" }]);
