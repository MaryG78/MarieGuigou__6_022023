const express = require("express");
const app = express();
app.use(express.json());
const routes = require("./routes/index");
require("./config/db.config")



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

// app.use((req, res, next) => {
//   res.json({ message: "ça fonctionne" });
//   next();
// });

// app.use((req, res) => {
//   res.status(201);
// });

app.use("/api", routes);


module.exports = app;

