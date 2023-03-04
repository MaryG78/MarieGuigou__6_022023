const express = require("express");
const app = express();
app.use(express.json());
const routes = require("./routes/index");
require("./config/db.config");
const path = require("path");
const logger = require("./config/logger");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");

// CORS management
app.use(cors());
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
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


module.exports = app;
