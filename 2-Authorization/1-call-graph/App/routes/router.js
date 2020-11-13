const express = require('express');

const todoController = require('../controllers/todoController');
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
router.get('/profile', msal.isAuthenticated, msal.getToken, mainController.getProfilePage); // get token for this route to call web API
router.get('/id', msal.isAuthenticated, mainController.getIdPage);
router.get('/write', msal.isAuthenticated, todoController.writeNote);
router.post('/write', msal.isAuthenticated, todoController.postNote);
router.get('/notes/:noteId', msal.isAuthenticated, todoController.seeNote);
router.post('/see', msal.isAuthenticated, todoController.seeNote);
router.post('/delete', msal.isAuthenticated, todoController.deleteNote);
router.post('/update', msal.isAuthenticated, todoController.updateNote);
router.get('/read', msal.isAuthenticated, todoController.readNotes);

// 404
router.get('*', (req, res) => res.status(404).redirect('/404.html'));

module.exports = router;