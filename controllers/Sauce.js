// mettre la logique métier des routes du fichier routes/routers
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sauce = require("../models/sauce");
const express = require("express");
const app = express();

app.use(express.json());

exports.createSauce = (req, res) => { 
  const sauce = new Sauce({
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    usersLiked: req.body.usersLiked,
    usersDisliked: req.body.usersDisliked,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// exports.getSauce = (req, res, next) => {
  
// };
