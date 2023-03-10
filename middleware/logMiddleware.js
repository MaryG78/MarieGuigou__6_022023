const logger = require("../config/logger")

function logMiddleware(req, res, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

module.exports = logMiddleware;
