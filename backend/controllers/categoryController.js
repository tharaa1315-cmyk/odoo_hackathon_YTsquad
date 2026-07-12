const Category = require("../models/Category");
const buildCrudController = require("./crudControllerFactory");

module.exports = buildCrudController(Category, ["name", "code"], [{ path: "parentCategory", select: "name" }]);
