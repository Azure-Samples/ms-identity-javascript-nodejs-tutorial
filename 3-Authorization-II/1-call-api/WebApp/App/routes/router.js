const express = require('express');

const mainController = require('../controllers/mainController');

const config = require('../../auth.json');
const cache = require('../utils/cachePlugin');
const MsalNodeWrapper = require('MsalNodeWrapper/MsalNodeWrapper');

const msal = new MsalNodeWrapper(config, cache);

// initialize router
const router = express.Router();

// app routes
router.get('/', (req, res, next) => res.redirect('/home'));
router.get('/home', mainController.getHomePage);

// authentication routes
router.get('/signin', msal.signIn);
router.get('/signout', msal.signOut);
router.get('/redirect', msal.handleRedirect); 

// authorized routes
router.get('/id', msal.isAuthenticated, mainController.getIdPage);
router.get('/webapi', msal.isAuthenticated, msal.getToken, mainController.getWebAPI) // get token for this route to call web API

// 404
router.get('*', (req, res) => res.status(404).redirect('/404.html'));

module.exports = router;