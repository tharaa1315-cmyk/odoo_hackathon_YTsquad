const buildCrudRouter = require("./crudRouterFactory");
const departmentController = require("../controllers/departmentController");

module.exports = buildCrudRouter(departmentController);
