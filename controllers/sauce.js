// mettre la logique métier des routes du fichier routes/routers
const Sauce = require("../models/sauce");
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

exports.createSauce = (req, res, next) => {
  if (!req.file) {
    return res.status(422).json({ message: "Missing image" });
  }
  if (!req.body.sauce) {
    return res.status(422).json({ message: "missing text" });
  }

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
      res.status(201).json({ message: "Your sauce has been created" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      if (sauces.length <= 0) {
        return res.status(404).json({ error: "No sauce has been created yet" });
      } else {
        const saucesHateoas = sauces.map((sauce) => {
          const link = hateoas(req, sauce._id);
          return {
            ...sauce._doc,
            link,
          };
        });
        res.status(200).json(saucesHateoas);
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce, hateoas(req, sauce._id)))
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
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => {
          res.status(201).json({ message: "Your sauce has been modified" });
        })
        .catch((error) => res.status(400).json({ error }))
 };

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({ message: "Sauce deleted!" });
        })
        .catch((error) => res.status(400).json({ error }));
    });
  });
    }


function hateoas(req, id) {
  const Uri = `${req.protocol}://${req.get("host")}`;

  return [
    {
      rel: "create",
      method: "POST",
      title: "Create Sauce",
      href: Uri + "/api/sauces",
    },
    {
      rel: "modify",
      method: "PUT",
      title: "Modify Sauce",
      href: Uri + "/api/sauces/" + id,
    },
    {
      rel: "getOne",
      method: "GET",
      title: "Read One Sauce",
      href: Uri + "/api/sauces/" + id,
    },
    {
      rel: "getAll",
      method: "GET",
      title: "Read All Sauces",
      href: Uri + "/api/sauces",
    },

    {
      rel: "delete",
      method: "DELETE",
      title: "Delete Sauce",
      href: Uri + "/api/sauces/" + id,
    },
    {
      rel: "likeDislike",
      method: "POST",
      title: "Like or Dislike Sauce",
      href: Uri + "/api/sauces/" + id + "/like",
    },
  ];
}
