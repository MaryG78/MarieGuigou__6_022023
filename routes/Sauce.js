const express = require("express");
const app = express();
const auth = require("../middleware/auth");
app.use(express.json());
const router = express.Router();
const sauceCtrl = require("../controllers/Sauce");
const multer = require("../middleware/multer");

router.post("/sauces", auth, multer, sauceCtrl.createSauce);
// router.get("/sauce", auth, sauceCtrl.getSauce)

module.exports = router;
