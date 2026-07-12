const Vendor = require("../models/Vendor");
const buildCrudController = require("./crudControllerFactory");

module.exports = buildCrudController(Vendor, ["name", "contactPerson", "email", "phone"]);
