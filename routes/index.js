const express = require('express')
const router = express.Router();
const userRoute = require('./user')
const sauceRoute = require('./Sauce')
const multer = require('../middleware/multer')

// const auth = require('auth') 


router.use("/auth", userRoute)
router.use(sauceRoute);


module.exports = router

// integrer l'authentificateur ds les gestionnaires de route
// ex : router.get('/', auth, chemin de la route)