const Employee = require("../models/Employee");
const buildCrudController = require("./crudControllerFactory");

module.exports = buildCrudController(Employee, ["name", "employeeId", "email", "designation"], [
  { path: "department", select: "name" },
  { path: "user", select: "email role" },
]);
