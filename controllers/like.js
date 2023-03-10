const Sauce = require("../models/sauce");

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const isUserLiked = sauce.usersLiked.includes(req.body.userId);
      const isUsersDisliked = sauce.usersDisliked.includes(req.body.userId);

      switch (req.body.like) {
        case 1:
          let updateLike = {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          };

          if (isUsersDisliked) {
            updateLike = {
              $inc: { likes: 1, dislikes: -1 },
              $push: { usersLiked: req.body.userId },
              $pull: { usersDisliked: req.body.userId },
            };
          }
          if (!isUserLiked) {
            Sauce.updateOne({ _id: req.params.id }, updateLike)
              .then(() => res.status(201).json({ message: "Sauce like +1" }))
              .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(201).json({ message: "Already liked" });
          }
          break;

        case -1:
          let updateDislike = {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          };

          if (isUserLiked) {
            updateDislike = {
              $inc: { dislikes: 1, likes: -1 },
              $push: { usersDisliked: req.body.userId },
              $pull: { usersLiked: req.body.userId },
            };
          }
          if (!isUsersDisliked) {
            Sauce.updateOne({ _id: req.params.id }, updateDislike)
              .then(() => res.status(201).json({ message: "Sauce dislike +1" }))
              .catch((error) => res.status(400).json({ error }));
          } else {
            res.status(201).json({ message: "Already disliked" });
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

          if (!isUserLiked && !isUsersDisliked) {
            res.status(200).json({
              message:
                "Vous n'avez pas encore donné votre avis sur cette sauce.",
            });
          }
          break;
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
