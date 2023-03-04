const express = require("express");
const app = express();
app.use(express.json());
const routes = require("./routes/index");
require("./config/db.config");
const path = require("path");
const logger = require("./config/logger");

// CORS management
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("./images", express.static(path.join(__dirname, "images")));
app.use("/api", routes);
app.use(function (req, res, next) {
  req.logger = logger;
  next();
});

module.exports = app;
