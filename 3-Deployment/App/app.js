/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config( { path: __dirname + '/.env.example' });

const path = require('path');
const express = require('express');
const session = require('express-session');
const { WebAppAuthProvider } = require('msal-node-wrapper');

const authConfig = require('./authConfig.js');
const mainRouter = require('./routes/mainRoutes');

const { getCredentialFromKeyVault } = require('./utils/keyVaultManager');

const SERVER_PORT = process.env.PORT || 4000;

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
            secure: false,
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
        console.log(process.env.KEY_VAULT_URI);
        const clientSecret = await getCredentialFromKeyVault(process.env.KEY_VAULT_URI, process.env.SECRET_NAME);
        
        const authConfigWithSecret = {
            ...authConfig,
            authOptions: {
                ...authConfig.authOptions,
                clientSecret: clientSecret.value
            }
        }

        const authProvider = await WebAppAuthProvider.initialize(authConfigWithSecret);

        app.use(authProvider.authenticate({
            protectAllRoutes: true,
            acquireTokenForResources: {
                "graph.microsoft.com": {
                    scopes: ["User.Read"],
                    routes: ["/profile"]
                },
            }
        }));

        // pass the instance to your routers
        app.use(mainRouter);

        app.use(authProvider.interactionErrorHandler());

        app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
    } catch (error) {
        console.log(error);
    }

}

main();

module.exports = main;