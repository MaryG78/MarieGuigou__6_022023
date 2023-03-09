const express = require("express"); // import d'Express
const routes = require("./routes/index"); // import des routes qui sont dans l'index
require("./config/db.config"); // import de la BDD
require("dotenv").config();
const path = require("path"); // accès au path du server
const logger = require("./config/logger");
const mongoSanitize = require("express-mongo-sanitize"); // protection contre l'injection NoSQL
const mongoose = require("mongoose");
const limiter = require("./middleware/limiter");
const speedLimiter = require("./middleware/limiter");
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
    origin: process.env.CLIENT_ENDPOINT, 
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

app.use(mongoSanitize());

app.use("/api", limiter, speedLimiter, routes); // on applique nos routes à notre application

app.use("/images", express.static(path.join(__dirname, "images"))); // service de fichiers statics à partir du dossier images

app.use(function (req, res, next) {
  req.logger = logger;
  next();
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Export de la variable app pour pouvoir l'utiliser dans d'autres fichiers.
module.exports = app;
