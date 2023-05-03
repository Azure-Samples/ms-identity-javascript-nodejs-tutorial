/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();
var authController = require("../controller/authController")
var passport = require('passport');
var authProvider = require("../auth/AuthProvider")

router.get('/login', authController.login);

router.post(
    '/redirect',
    authController.handleRedirect,
    passport.authenticate('passport-custom-authentication-strategy', { failureRedirect: '/auth/login', keepSessionInfo: true }),
    function (req, res, next) {
        const state = JSON.parse(authProvider.cryptoProvider.base64Decode(req.body.state));
        res.redirect(state.redirectTo);
    }
);

router.get('/logout', authController.logout);

module.exports = router;
