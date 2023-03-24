const bcrypt = require("bcrypt");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();


// ENCRYPTED EMAIL
function encrypted(email) {
  return cryptoJs.AES.encrypt(
    email,
    cryptoJs.enc.Base64.parse(process.env.PASSPHRASE),
    {
      iv: cryptoJs.enc.Base64.parse(process.env.IV),
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7,
    }
  ).toString();
}

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
        .then(() => res.status(201).json({ message: "User created" }))
        .catch((error) => res.status(422).json({ error })); 
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  var emailEncrypted = encrypted(req.body.email);

  User.findOne({ email: emailEncrypted })
    .then((user) => {
      if (!user) {
        res
          .status(400) 
          .json({ message: "Incorrect login/password pair" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(400).json({
                message: "Incorrect login/password pair",
              });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  process.env.TOKEN_SECRET,
                  {
                    expiresIn: "24h",
                  }
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
