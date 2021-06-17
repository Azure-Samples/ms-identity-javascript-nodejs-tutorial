const express = require('express');

const mainController = require('../controllers/mainController');
const todolistRouter = require('./todolistRoutes');
const dashboardRouter = require('./dashboardRoutes');

const config = require('../appSettings.js');

module.exports = (authProvider) => {

    // initialize router
    const router = express.Router();

    // app routes
    router.get('/', (req, res, next) => res.redirect('/home'));
    router.get('/home', mainController.getHomePage);

    // authentication routes
    router.get('/signin', authProvider.login({ postLogin: '/' }));
    router.get('/signout', authProvider.logout({ postLogout: '/' }));

    // secure routes
    router.get('/id', authProvider.isAuthenticated(), mainController.getIdPage);

    router.use('/todolist',
        authProvider.isAuthenticated(),
        authProvider.hasAccess({
            accessRule: config.accessMatrix.todolist
        }),
        todolistRouter
    );

    router.use('/dashboard',
        authProvider.isAuthenticated(),
        authProvider.hasAccess({
            accessRule: config.accessMatrix.dashboard
        }),
        dashboardRouter
    );

    // unauthorized
    router.get('/error', (req, res) => res.redirect('/500.html'));

    // error
    router.get('/unauthorized', (req, res) => res.redirect('/401.html'));

    // 404
    router.get('*', (req, res) => res.status(404).redirect('/404.html'));

    return router;
}