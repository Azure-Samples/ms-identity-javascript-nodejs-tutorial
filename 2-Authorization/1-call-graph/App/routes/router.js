const express = require('express');
const msalWrapper = require('msal-express-wrapper');

const mainController = require('../controllers/mainController');

const config = require('../appSettings.json');
const cache = require('../utils/cachePlugin');

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
router.get('/id', authProvider.isAuthenticated, mainController.getIdPage);
router.get('/profile', authProvider.isAuthenticated, authProvider.getToken, mainController.getProfilePage); // get token for this route to call web API
router.get('/tenant', authProvider.isAuthenticated, authProvider.getToken, mainController.getTenantPage) // get token for this route to call web API

// 404
router.get('*', (req, res) => res.status(404).redirect('/404.html'));

module.exports = router;