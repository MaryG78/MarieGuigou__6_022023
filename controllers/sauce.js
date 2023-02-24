// mettre la logique métier des routes du fichier routes/routers
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sauce = require("../models/sauce");
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// exports.getSauce = (req, res, next) => {

// };
