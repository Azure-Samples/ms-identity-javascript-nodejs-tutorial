/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const MsIdExpress = require('microsoft-identity-express');
const appSettings = require('./appSettings');
const mainRouter = require('./routes/mainRoutes');

const SERVER_PORT = process.env.PORT || 4000;

async function main() {
    const app = express();

    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'ejs');

    app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
    app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

    app.use(express.static(path.join(__dirname, './public')));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    /**
     * Using express-session middleware. Be sure to familiarize yourself with available options
     * and set them as desired. Visit: https://www.npmjs.com/package/express-session
     */
    app.use(session({
        secret: 'ENTER_YOUR_SECRET_HERE',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true, 
        }
    }));

    /**
     * In App Service, SSL termination happens at the network load balancers, so all HTTPS requests reach your app as unencrypted HTTP requests.
     * The line below is needed for getting the correct absolute URL for redirectUri configuration. For more information, visit: 
     * https://docs.microsoft.com/azure/app-service/configure-language-nodejs?pivots=platform-linux#detect-https-session
     */
    app.set('trust proxy', 1)

    try {
        /**
         * In order to initialize the wrapper with the credentials fetched from
         * Azure Key Vault, we use the async builder pattern.
         */
        const msid = await new MsIdExpress.WebAppAuthClientBuilder(appSettings)
            .withKeyVaultCredentials({
                credentialType: "clientSecret",
                credentialName: process.env["SECRET_NAME"],
                keyVaultUrl: process.env["KEY_VAULT_URI"]
            }).buildAsync();

        app.use(msid.initialize());

        app.use(mainRouter(msid));

        app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}!`));
    } catch (error) {
        console.log(error);
    }

    module.exports = app;
}

main();