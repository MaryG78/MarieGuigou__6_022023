const express = require("express");
const app = express();
app.use(express.json());
const router = express.Router();
const sauceCtrl = require("../controllers/Sauce");


router.post("/sauce", sauceCtrl.createSauce);
// router.get("/sauce", sauceCtrl.getSauce)

module.exports = router;