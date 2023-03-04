const bunyan = require("bunyan");

// Configuration du logger
const logger = bunyan.createLogger({
  name: "Piquante",
  level: "info",
});

// Exportation du logger
module.exports = logger;
