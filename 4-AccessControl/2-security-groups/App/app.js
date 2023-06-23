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

    // initialize the wrapper
    const authProvider = await WebAppAuthProvider.initialize(authConfig);

    app.use(authProvider.authenticate({
        protectAllRoutes: true,
    }));

    app.get(
        '/todolist',
        authProvider.guard({
            forceLogin: true,
            idTokenClaims: {
                // groups: ["Enter_the_ObjectId_of_GroupAdmin", "Enter_the_ObjectId_of_GroupMember"],
                groups: ["2d7dc7c6-824f-4796-9323-30ca71e3e6bf", "51259a55-8477-4d90-b130-34c73610bb53"],
            },
        })
    );

    app.get(
        '/dashboard',
        authProvider.guard({
            forceLogin: true,
            idTokenClaims: {
                // groups: ["Enter_the_ObjectId_of_GroupAdmin"],
                groups: ["51259a55-8477-4d90-b130-34c73610bb53"],
            },
        })
    );

    // pass the instance to your routers
    app.use(mainRouter);

    app.use(authProvider.interactionErrorHandler());

    app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
}

main();

module.exports = main;