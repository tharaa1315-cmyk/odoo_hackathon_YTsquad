const Department = require("../models/Department");
const buildCrudController = require("./crudControllerFactory");

module.exports = buildCrudController(Department, ["name", "code"], [{ path: "manager", select: "name email" }]);
