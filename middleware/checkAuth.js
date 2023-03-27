const jwt = require("jsonwebtoken");
const Sauce = require("../models/sauce");
require("dotenv").config();

module.exports = (req, res, next) => {
  const sauceId = req.params.id;
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: "Sauce not found" });
      }
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      const userId = decodedToken.userId;
      if (sauce.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      next();
    })
    .catch((error) => res.status(500).json({ error }));
}

