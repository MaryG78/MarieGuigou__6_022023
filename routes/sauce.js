const express = require("express");
const app = express();
const auth = require("../middleware/auth");
app.use(express.json());
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const multer = require("../middleware/multer");
const like = require("../controllers/like");
const checkAuth = require("../middleware/checkAuth")



router.post("/", auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, like.likeSauce);
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, checkAuth, sauceCtrl.modifySauce);
router.delete("/:id", auth, checkAuth, sauceCtrl.deleteSauce);

module.exports = router;
