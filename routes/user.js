const express = require("express");
const auth = require("../middleware/auth");
const app = express();
app.use(express.json());
const router = express.Router();
const userCtrl = require("../controllers/user");
const multer = require("../middleware/multer");


router.post("/signup", userCtrl.signup);
router.post("/login",  userCtrl.login);

module.exports = router;

