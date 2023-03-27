const express = require('express')
const router = express.Router();
const userRoute = require('./user')
const sauceRoute = require('./sauce')
const multer = require('../middleware/multer')



router.use("/auth", userRoute)
router.use("/sauces", sauceRoute);


module.exports = router
