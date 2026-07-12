const buildCrudRouter = require("./crudRouterFactory");
const employeeController = require("../controllers/employeeController");

module.exports = buildCrudRouter(employeeController, ["administrator", "department_manager"]);
