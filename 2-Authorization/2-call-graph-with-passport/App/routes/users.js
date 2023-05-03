/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();
var authProvider = require('../auth/AuthProvider');
var { protectedResources } = require('../authConfig');
var userController = require('../controller/userController');

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login'); // redirect to sign-in route
    }

    next();
}

/* GET users listing. */
router.get('/id', isAuthenticated, function (req, res, next) {
    res.render('id', { idTokenClaims: req.user._json });
});

router.get(
    '/profile',
    isAuthenticated,
    authProvider.getToken(protectedResources.graphAPI.scopes),
    userController.profile
);

module.exports = router;
