const express = require('express');
const msalWrapper = require('msal-express-wrapper');

const mainController = require('../controllers/mainController');
const todolistController = require('../controllers/todolistController');
const dashboardController = require('../controllers/dashboardController');

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

// admin route
router.get('/dashboard', authProvider.isAuthenticated, authProvider.hasAccess, dashboardController.getAllTodos);

// user routes
router.get('/todolist', authProvider.isAuthenticated, authProvider.hasAccess, todolistController.getTodos);
router.post('/todolist', authProvider.isAuthenticated, authProvider.hasAccess, todolistController.postTodo);
router.delete('/todolist/:id', authProvider.isAuthenticated, authProvider.hasAccess, todolistController.deleteTodo);

// 404
router.get('*', (req, res) => res.status(404).redirect('/404.html'));

module.exports = router;