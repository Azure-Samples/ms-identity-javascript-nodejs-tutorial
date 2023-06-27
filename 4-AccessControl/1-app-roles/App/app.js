/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const path = require('path');
const express = require('express');
const session = require('express-session');
const { WebAppAuthProvider } = require('msal-node-wrapper');

const authConfig = require('./authConfig.js');
const mainRouter = require('./routes/mainRoutes');

async function main() {

    // initialize express
    const app = express();

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

    try {
        // initialize the auth middleware before any route handlers
        const authProvider = await WebAppAuthProvider.initialize(authConfig);

        app.use(authProvider.authenticate({
            protectAllRoutes: true, // enforce login for all routes
        }));

        app.get(
            '/todolist',
            authProvider.guard({
                idTokenClaims: {
                    roles: ["TaskUser", "TaskAdmin"], // require the user's ID token to have either of these role claims
                },
            }),
        );

        app.get(
            '/dashboard',
            authProvider.guard({
                idTokenClaims: {
                    roles: ["TaskAdmin"], // require the user's ID token to have this role claim
                },
            })
        );

        app.use(mainRouter);

        /**
         * This error handler is needed to catch interaction_required errors thrown by MSAL.
         * Make sure to add it to your middleware chain after all your routers, but before any other 
         * error handlers.
         */
        app.use(authProvider.interactionErrorHandler());

        return app;
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = main;