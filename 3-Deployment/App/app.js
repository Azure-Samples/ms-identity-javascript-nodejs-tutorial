/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express');
const session = require('express-session');
const path = require('path');

const router = require('./routes/router');
const SERVER_PORT = process.env.PORT || 4000;

// initialize express
const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, './public')));

app.use(express.json());

/**
 * In App Service, SSL termination happens at the network load balancers, so all HTTPS requests reach your app as unencrypted HTTP requests.
 * The line below is needed for getting the correct absolute URL for redirectUri configuration. For more information, visit: 
 * https://docs.microsoft.com/azure/app-service/configure-language-nodejs?pivots=platform-linux#detect-https-session
 */
app.set('trust proxy', 1);

/**
 * Using express-session middleware. Be sure to familiarize yourself with available options
 * and set as desired. Visit: https://www.npmjs.com/package/express-session
 */
app.use(session({
    secret: 'ENTER_YOUR_SECRET_HERE',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true } // only if HTTPS connection is used
}));

app.use(router);

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));