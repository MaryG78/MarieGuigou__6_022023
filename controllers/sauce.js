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

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id }) // on récupère la sauce ds la base de données
    .then((sauce) => {
      // on verifier que la sauce appartient bien au user qui nous envoie la requête put
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id }, // la sauce à mettre à jour
          { ...sauceObject, _id: req.params.id }) // avec quel objet : avec ce qu'on a récupéré ds le corps de la fonction
              .then(() => res.status(200).json({ message: "La sauce a été modifiée" }))
              .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1]; // récupère le nom du fichier à supp
        fs.unlink(`images/${filename}`, () => { 
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};




