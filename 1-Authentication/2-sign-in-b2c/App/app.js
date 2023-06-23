/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const path = require('path');
const express = require('express');
const session = require('express-session');
const { WebAppAuthProvider } = require('msal-node-wrapper');

const mainController = require('./controllers/mainController');

const SERVER_PORT = process.env.PORT || 4000;

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
            secure: false, // set this to true on production
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
    const authProvider = await WebAppAuthProvider.initialize({
        authOptions: {
            authority: "https://login.microsoftonline.com/cbaf2168-de14-4c72-9d88-f5f05366dbef/",
            clientId: "82e01ead-82f8-4ec4-9c82-fea5347c33b2",
            clientSecret: "yLl8Q~ssTFDlNRu~-PfrLwf32XCwEaVhyjJJhcov",
            redirectUri: "/redirect",
        },
        systemOptions: {
            loggerOptions: {
                loggerCallback: (logLevel, message, containsPii) => {
                    if (containsPii) {
                        return;
                    }

                    console.log(message);
                },
                piiLoggingEnabled: false,
                logLevel: 3,
            },
        }
    });

    // initialize the wrapper
    app.use(authProvider.authenticate());

    // app routes
    app.get('/', mainController.getHomePage);

    // authentication routes
    app.get(
        '/signin',
        (req, res, next) => {
            return req.authContext.login({
                postLoginRedirectUri: "/",
                postFailureRedirectUri: "/"
            })(req, res, next);
        }
    );

    app.get(
        '/signout',
        (req, res, next) => {
            return req.authContext.logout({
                postLogoutRedirectUri: "/",
            })(req, res, next);
        }
    );

    // secure routes
    app.get('/id',
        authProvider.guard({
            forceLogin: true
        }),
        mainController.getIdPage
    );

    app.use(authProvider.interactionErrorHandler());

    app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
}

main();

module.exports = main;