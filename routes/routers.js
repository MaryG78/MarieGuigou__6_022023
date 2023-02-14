const express = require('express')
const router = express.Router();
const auth = require('auth') 
const routerCtrl = require('../controllers/router')



// integrer l'authentificateur ds les gestionnaires de route
// ex : router.get('/', auth, chemin de la route)