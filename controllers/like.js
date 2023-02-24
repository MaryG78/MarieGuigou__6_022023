const Sauce = require("../models/sauce");
const express = require("express");
const app = express();

app.use(express.json());

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const isUserLiked = sauce.usersLiked.includes(req.body.userId);
      const isUsersDisliked = sauce.usersDisliked.includes(req.body.userId);

      switch (req.body.like) {
        case 1:
          if (!isUserLiked && !isUsersDisliked) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "Sauce like +1" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        case -1:
          if (!isUsersDisliked && !isUserLiked) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "Sauce dislike 1" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        case 0:
          if (isUserLiked) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "Sauce like -1" }))
              .catch((error) => res.status(400).json({ error }));
          }

          if (isUsersDisliked) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "Sauce dislike -1" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
