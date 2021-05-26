const express = require('express');

const mainController = require('../controllers/mainController');

const config = require('../appSettings.json');
const cache = require('../utils/cachePlugin');
const msalWrapper = require('msal-express-wrapper');

// initialize wrapper
const authProvider = new msalWrapper.AuthProvider(config, cache);

// initialize router
const router = express.Router();

// app routes
router.get('/', (req, res, next) => res.redirect('/home'));
router.get('/home', mainController.getHomePage);

// authentication routes
router.get('/signin', authProvider.signIn);
router.get('/signout', authProvider.signOut);
router.get('/redirect', authProvider.handleRedirect);

// secure routes
router.get('/id', authProvider.isAuthenticated, mainController.getIdPage); // get token for this route to call web API

// 404
router.get('*', (req, res) => res.status(404).redirect('/404.html'));

module.exports = router;