const express = require("express");
const cookieParser = require('cookie-parser');
require('dotenv').config();
const nocache = require('nocache');
const { responseStructure } = require("./app/utils/utilityService");
const session = require('express-session');

// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();
// Define Oauth2 Implementation
app.use(session({secret: 'grant', saveUninitialized: true, resave: false}));

global.__basedir = __dirname;
global.jwtExpiresIn = 15 * 24 * 3600;

let corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));
app.use(nocache());

// Use cookie parser
app.use(cookieParser());

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// Serving static files
app.use(express.static('public'));

// simple route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to TodoAPI API Service." });
});

// routes
require("./app/routes/todos.routes.js")(app);
require("./app/routes/clients.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

// Catch 404 handler
app.use((req, res, next) => {
  res.status(404).send(responseStructure("Resource Not Found", false, []));
});
app.use((error, req, res, next) => {
  res.status(error.status || 500).send(
      responseStructure(error.message || "Internal Server Error", false, []));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});