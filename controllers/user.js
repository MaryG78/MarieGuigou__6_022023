const bcrypt = require("bcrypt");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// ENCRYPTED EMAIL
function encrypted(email) {
  return cryptoJs.AES.encrypt(
    email,
    cryptoJs.enc.Base64.parse(process.env.PASSPHRASE),
    {
      iv: cryptoJs.enc.Base64.parse(process.env.IV),
      mode: cryptoJs.mode.ECB,
      padding: cryptoJs.pad.Pkcs7,
    }
  ).toString();
}

// DECRYPTED EMAIL
// function decryptEmail(email) {
//   var bytes = cryptoJs.AES.decrypt(
//     email,
//     cryptoJs.enc.Base64.parse(process.env.PASSPHRASE),
//     {
//       iv: cryptoJs.enc.Base64.parse(process.env.IV),
//       mode: cryptoJs.mode.ECB,
//       padding: cryptoJs.pad.Pkcs7,
//     }
//   );
//   return bytes.toString(cryptoJs.enc.Utf8);
// }

exports.signup = (req, res, next) => {
  // chiffrage de l'email avant envoie
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const emailEncrypted = encrypted(req.body.email);
      const user = new User({
        email: emailEncrypted,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur crée" }))
        .catch((error) => res.status(422).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  var emailEncrypted = encrypted(req.body.email);

  User.findOne({ email: emailEncrypted })
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
