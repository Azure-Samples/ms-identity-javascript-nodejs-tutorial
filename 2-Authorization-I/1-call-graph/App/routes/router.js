const express = require('express');

const mainController = require('../controllers/mainController');

const auth = require('../../auth.json');
const MsalExpressMiddleware = require('../utils/msalExpressMiddleware');

const msal = new MsalExpressMiddleware(auth);

// initialize router
const router = express.Router();

// app routes
router.get('/', (req, res, next) => res.redirect('/home'));
router.get('/home', mainController.getHomePage);

// authentication routes
router.get('/signin', msal.signIn);
router.get('/signout', msal.signOut);
router.get('/redirect', msal.handleRedirect);

// protected routes
router.get('/id', msal.isAuthenticated, mainController.getIdPage);
router.get('/profile', msal.isAuthenticated, msal.getToken, mainController.getProfilePage); // get token for this route to call web API
router.get('/tenant', msal.getToken, mainController.getTenantPage) // get token for this route to call web API

// 404
router.get('*', (req, res) => res.status(404).redirect('/404.html'));

module.exports = router;