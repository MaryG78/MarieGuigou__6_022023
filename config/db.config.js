require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    SSL: true,
  })
  .then(() => console.log("Successfully connected to MongoDB!"))
  .catch(() => console.log("Failed to connect to MongoDB!"));

module.exports = mongoose.connection;
