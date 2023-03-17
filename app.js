const express = require("express"); // import d'Express
const routes = require("./routes/index"); // import des routes qui sont dans l'index
require("./config/db.config"); // import de la BDD
require("dotenv").config();
const path = require("path"); // accès au path du server
const mongoSanitize = require("express-mongo-sanitize"); // protection contre l'injection NoSQL
const mongoose = require("mongoose");
const rateLimiter = require("./middleware/rateLimite");
const speedLimiter = require("./middleware/slowDown");
const helmet = require("helmet");
const hateoasLinker = require("express-hateoas-links");

// Création d'une constante app = notre application / Appel de la méthode express
const app = express();

app.use(express.json());

app.use(hateoasLinker);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// MIDDLEWARE CORS
const cors = require("cors");
app.use(
  cors({
    // origin: process.env.CLIENT_ENDPOINT,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
    origin: "http://localhost:4200",
  })
);

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
const logger = require("./config/logger");
app.use((req, res, next) => {
  logger.info(req.body);
  let oldSend = res.send;
  res.send = function (data) {
    logger.info(JSON.parse(data));
    oldSend.apply(res, arguments);
  };
  next();
});

app.use(mongoSanitize());

app.use("/api", rateLimiter, speedLimiter, routes); // on applique nos routes à notre application

app.use("/images", express.static(path.join(__dirname, "images"))); // service de fichiers statics à partir du dossier images

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Export de la variable app pour pouvoir l'utiliser dans d'autres fichiers.
module.exports = app;
