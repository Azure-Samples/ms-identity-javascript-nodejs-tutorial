const express = require('express');

const identity = require('../utils/identity');
const mainController = require('../controllers/mainController');

// initialize router
const router = express.Router();

// app routes
router.get('/', (req, res, next) => res.redirect('/home'));
router.get('/home', mainController.getHomePage);

// authentication routes
router.get('/signin', identity.signIn);
router.get('/signout', identity.signOut);
router.get('/redirect', identity.handleRedirect);

// protected routes
router.get('/profile', identity.isAuthenticated, mainController.getProfile); // get token for this route to call web API
router.get('/edit', identity.isAuthenticated, identity.editProfile);

// 404
router.get('*', (req, res) => res.status(404).redirect('/404.html'));

module.exports = router;