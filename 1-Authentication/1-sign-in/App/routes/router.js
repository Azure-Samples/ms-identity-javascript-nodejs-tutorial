const express = require('express');

const mainController = require('../controllers/mainController');

const MsalExpressMiddleware = require('../../../../MsalNodeCommons/MsalExpressMiddleware');
const auth = require('../../auth.json');
const cache = require('../utils/cachePlugin');

const msal = new MsalExpressMiddleware(auth, cache);

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

// 404
router.get('*', (req, res) => res.status(404).redirect('/404.html'));

module.exports = router;