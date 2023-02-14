const express = require("express");
const app = express();
const mongoose = require("mongoose");
const sauce = require('./models/sauce')
const user = require("./models/user");
const userRoutes = require("./routes/user");

app.use((req, res) => {
  res.json({ message: "Votre requête a été reçue" });
});

mongoose.connect( "mongodb+srv://MGuigou:Jude111112@cluster0.zlv4t4d.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// CORS management
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/auth", userRoutes);

module.exports = app;
