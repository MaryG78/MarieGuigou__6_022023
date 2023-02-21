const Sauce = require("../models/sauce");
const { createSauce } = require("./Sauce");

exports.likeSauce = (req, res, next) => {
  console.log("je suis dans le controller like ");

  sauce
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce.usersLiked.include(req.body.userId) && req.body.likes === 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce Like +1" }))
          .catch((error) => res.status(400).json({ error }));
      }
      if (sauce.usersLiked.include(req.body.userId) && req.body.likes === 0) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce Like 0" }))
          .catch((error) => res.status(400).json({ error }));
      }

      if (
        !sauce.usersDisliked.include(req.body.userId) &&
        req.body.dislikes === -1
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce dislike +1" }))
          .catch((error) => res.status(400).json({ error }));
      }

      if (
        sauce.usersDisliked.include(req.body.userId) &&
        req.body.dislikes === 0
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce dislike 0" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
