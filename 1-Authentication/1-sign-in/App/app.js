/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const path = require('path');
const express = require('express');
const session = require('express-session');
const { WebAppAuthProvider } = require('msal-node-wrapper');

const mainController = require('./controllers/mainController');
const authConfig = require('./authConfig.js');

const SERVER_PORT = process.env.PORT || 4000;

// initialize express
const app = express();

async function main() {

    /**
     * Using express-session middleware. Be sure to familiarize yourself with available options
     * and set them as desired. Visit: https://www.npmjs.com/package/express-session
     */
    app.use(session({
        secret: 'ENTER_YOUR_SECRET_HERE',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // set this to true on production
        }
    }));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'ejs');

    app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
    app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

    app.use(express.static(path.join(__dirname, './public')));

    // instantiate the wrapper
    const authProvider = await WebAppAuthProvider.initialize(authConfig);

    // initialize the auth middleware before any route handlers
    app.use(authProvider.authenticate());

    // app routes
    app.get('/', mainController.getHomePage);

    // authentication routes
    app.get(
        '/signin',
        (req, res, next) => {
            return req.authContext.login({
                postLoginRedirectUri: "/", // redirect here after login
            })(req, res, next);
        }
    );

    app.get(
        '/signout',
        (req, res, next) => {
            return req.authContext.logout({
                postLogoutRedirectUri: "/", // redirect here after logout
            })(req, res, next);
        }
    );

    // secure routes
    app.get('/id',
        authProvider.guard({
            forceLogin: true // force user to login if not authenticated
        }),
        mainController.getIdPage
    );

    /**
     * This error handler is needed to catch interaction_required errors thrown by MSAL.
     * Make sure to add it to your middleware chain after all your routers, but before any other 
     * error handlers.
     */
    app.use(authProvider.interactionErrorHandler());

    app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
}

main();

module.exports = app;