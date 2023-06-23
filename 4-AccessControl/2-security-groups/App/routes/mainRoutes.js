const express = require('express');

const mainController = require('../controllers/mainController');
const todolistRouter = require('./todolistRoutes');
const dashboardRouter = require('./dashboardRoutes');

// initialize router
const router = express.Router();

// app routes
router.get('/', mainController.getHomePage);

// secure routes
router.get('/id', mainController.getIdPage);

// secure routes
router.get(
    '/signout',
    (req, res, next) => {
        return req.authContext.logout({
            postLogoutRedirectUri: "/",
        })(req, res, next);
    }
);

router.use(
    '/todolist',
    todolistRouter
);

router.use(
    '/dashboard',
    dashboardRouter
);

module.exports = router;