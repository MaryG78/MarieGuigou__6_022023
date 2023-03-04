const bcrypt = require("bcrypt");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const express = require("express");
const app = express();

app.use(express.json());

exports.signup = (req, res, next) => {
  // chiffrage de l'email avant envoie
  const emailCryptoJs = cryptoJs
    .HmacSHA256(req.body.email, `process.env.{$CRYPTOJS_EMAIL}`)
    .toString();
  ;
  console.log(emailCryptoJs);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: emailCryptoJs,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur crée" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    const emailCryptoJs = cryptoJs
      .HmacSHA256(req.body.email, `process.env.{$CRYPTOJS_EMAIL}`)
      .toString();
    ;

  User.findOne({ email: emailCryptoJs })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe incorrecte" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({
                message: "Paire identifiant/mot de passe incorrecte",
              });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                }),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};


