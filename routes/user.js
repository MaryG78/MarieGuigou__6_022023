const express = require("express");
const app = express();
app.use(express.json());
const router = express.Router();
const userCtrl = require("../controllers/user");


router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;

