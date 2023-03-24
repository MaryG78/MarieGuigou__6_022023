const express = require("express"); // import d'Express
const routes = require("./routes/index"); // import des routes qui sont dans l'index
require("./config/db.config"); // import de la BDD
require("dotenv").config(); // import des données du fichier .env
const path = require("path"); // accès au path du server
const mongoSanitize = require("express-mongo-sanitize"); // protection contre l'injection NoSQL
const mongoose = require("mongoose"); // Gestion de la bdd MongoDB
const rateLimiter = require("./middleware/rateLimite"); // Limite le nombre de requetes HTTP reçues par le serveur
const speedLimiter = require("./middleware/slowDown"); // Limite le nombre de requetes HTTP reçues par le serveur dans le temps
const helmet = require("helmet"); // protections contre les vulnérabilités les plus courantes
const hateoasLinker = require("express-hateoas-links"); // API REST

const app = express();

app.use(express.json());

app.use(hateoasLinker);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Gestion de la politique CORS
const cors = require("cors");
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
    origin: "http://localhost:4200",
  })
);

// Définition des en-têtes CORS de base pour les requêtes entrantes
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

app.use("/api", rateLimiter, speedLimiter, routes);

app.use("/images", express.static(path.join(__dirname, "images")));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = app;
