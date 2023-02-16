const express = require('express')
const router = express.Router();
const userRoute = require('./user')
// const auth = require('auth') 
// const routerCtrl = require('../controllers/router')

router.use("/auth", userRoute)

module.exports = router

// integrer l'authentificateur ds les gestionnaires de route
// ex : router.get('/', auth, chemin de la route)