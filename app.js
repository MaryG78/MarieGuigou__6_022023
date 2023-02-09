const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use((req, res) => {
  res.json({ message: "Votre requête a été reçue" });
});

mongoose
  .connect(
    "mongodb+srv://MGuigou:Jude111112@cluster0.zlv4t4d.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

module.exports = app;
