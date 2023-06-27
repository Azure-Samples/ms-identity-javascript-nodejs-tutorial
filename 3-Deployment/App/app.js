/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config({ path: __dirname + '/.env.example' });

const path = require('path');
const express = require('express');
const session = require('express-session');
const { WebAppAuthProvider } = require('msal-node-wrapper');

const authConfig = require('./authConfig.js');
const mainRouter = require('./routes/mainRoutes');

const { getCredentialFromKeyVault } = require('./utils/keyVaultManager');

async function main() {

    // initialize express
    const app = express();

    /**
     * In App Service, SSL termination happens at the network load balancers, so all HTTPS requests reach your app as unencrypted HTTP requests.
     * The line below is needed for getting the correct absolute URL for redirectUri configuration. For more information, visit: 
     * https://docs.microsoft.com/azure/app-service/configure-language-nodejs?pivots=platform-linux#detect-https-session
     */
    app.set('trust proxy', 1)

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
        const clientSecret = await getCredentialFromKeyVault(process.env.KEY_VAULT_URI, process.env.SECRET_NAME);

        const authConfigWithSecret = {
            ...authConfig,
            auth: {
                ...authConfig.auth,
                clientSecret: clientSecret.value
            }
        }

        const authProvider = await WebAppAuthProvider.initialize(authConfigWithSecret);

        // initialize the auth middleware before any route handlers
        app.use(authProvider.authenticate({
            protectAllRoutes: true, // this will force login for all routes if the user is not already
            acquireTokenForResources: {
                "graph.microsoft.com": { // you can specify the resource name as you wish
                    scopes: ["User.Read"],
                    routes: ["/profile"] // this will acquire a token for the graph on these routes
                },
            }
        }));

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