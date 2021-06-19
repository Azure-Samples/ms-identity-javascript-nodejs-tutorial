const express = require('express');

const mainController = require('../controllers/mainController');

const config = require('../appSettings.js');

module.exports = (authProvider) => {

    // initialize router
    const router = express.Router();

    // app routes
    router.get('/', (req, res, next) => res.redirect('/home'));
    router.get('/home', mainController.getHomePage);

    // authentication routes
    router.get('/signin', authProvider.signIn({ successRedirect: '/' }));
    router.get('/signout', authProvider.signOut({ successRedirect: '/' }));

    // secure routes
    router.get('/id', authProvider.isAuthenticated(), mainController.getIdPage);

    router.get('/profile', 
        authProvider.getToken({
            resource: config.remoteResources.graphAPI
        }), 
        mainController.getProfilePage
    );

    router.get('/tenant',
        authProvider.getToken({
            resource: config.remoteResources.armAPI
        }),
        mainController.getTenantPage
    );

    // unauthorized
    router.get('/error', (req, res) => res.redirect('/500.html'));

    // error
    router.get('/unauthorized', (req, res) => res.redirect('/401.html'));

    // 404
    router.get('*', (req, res) => res.status(404).redirect('/404.html'));

    return router;
}