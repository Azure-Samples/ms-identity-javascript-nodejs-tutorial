const express = require('express');

const mainController = require('../controllers/mainController');
const todolistRouter = require('./todolistRoutes');
const todolistController = require('../controllers/todolistController');
const dashboardRouter = require('./dashboardRoutes');

// initialize router
const router = express.Router();

router.get('/', mainController.getHomePage);
router.get('/id', mainController.getIdPage);

// auth routes
router.get(
    '/signout',
    (req, res, next) => {
        return req.authContext.logout({
            postLogoutRedirectUri: "/",
        })(req, res, next);
    }
);

router.get(
    '/signin',
    (req, res, next) => {
        return req.authContext.login({
            postLoginRedirectUri: "/",
            postFailureRedirectUri: "/signin"
        })(req, res, next);
    }
);

// nested routes
router.use(
    '/todolist',
    todolistRouter
);

router.use(
    '/dashboard',
    dashboardRouter
);

module.exports = router;