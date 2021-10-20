const express = require('express');
const mainController = require('../controllers/mainController');
const appSettings = require('../appSettings');

module.exports = (msid) => {
    // initialize router
    const router = express.Router();

    // app routes
    router.get('/', (req, res, next) => res.redirect('/home'));
    router.get('/home', mainController.getHomePage);

    // auth routes
    router.get('/signin', msid.signIn({ postLoginRedirect: "/" }));

    router.get('/signout', msid.signOut({ postLogoutRedirect: "/" }));

    // secure routes
    router.get('/id',
        msid.isAuthenticated(),
        mainController.getIdPage
    );

    router.get('/profile',
        msid.isAuthenticated(),
        msid.getToken({
            resource: appSettings.protectedResources.graphAPI
        }),
        mainController.getProfilePage
    ); // get token for this route to call web API

    router.get('/tenant',
        msid.isAuthenticated(),
        msid.getToken({
            resource: appSettings.protectedResources.armAPI
        }),
        mainController.getTenantPage
    ); // get token for this route to call web API

    // unauthorized
    router.get('/error', (req, res) => res.redirect('/500.html'));

    // error
    router.get('/unauthorized', (req, res) => res.redirect('/401.html'));

    // 404
    router.get('*', (req, res) => res.redirect('/404.html'));

    return router;
}