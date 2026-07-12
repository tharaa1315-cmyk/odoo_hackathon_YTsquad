const buildCrudRouter = require("./crudRouterFactory");
const categoryController = require("../controllers/categoryController");

module.exports = buildCrudRouter(categoryController);
