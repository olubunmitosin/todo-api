const todosController = require("../controllers/todos.controller");
const clientAuthenticate = require('../middleware/client-authenticate.js');
const express = require("express");
const router = express.Router();


module.exports = app => {
  router.get("/", clientAuthenticate, todosController.getAllTodos);
  router.get("/single", clientAuthenticate, todosController.getSingleTodo);
  router.post("/create", clientAuthenticate, todosController.createTodo);
  router.post("/update", clientAuthenticate, todosController.updateTodo);
  router.post("/delete", clientAuthenticate, todosController.deleteTodo);
  // Load router routes into app base url
  app.use('/api/todos', router);
};

