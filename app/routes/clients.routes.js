const clientController = require("../controllers/client.controller");
const express = require("express");
const router = express.Router();


module.exports = app => {
  router.post("/register", clientController.registerClient);
  router.post("/get-token", clientController.getClientToken);
  // Load router routes into app base url
  app.use('/api/client', router);
};

