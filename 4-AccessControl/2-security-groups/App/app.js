/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const msalWrapper = require('msal-express-wrapper');
const config = require('./appSettings.js');
const cache = require('./utils/cachePlugin');
const mainRouter = require('./routes/mainRoutes');

const SERVER_PORT = process.env.PORT || 4000;

// initialize express
const app = express(); 

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use(express.static(path.join(__dirname, './public')));

app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * Using express-session middleware. Be sure to familiarize yourself with available options
 * and set them as desired. Visit: https://www.npmjs.com/package/express-session
 */
 const sessionConfig = {
    secret: 'ENTER_YOUR_SECRET_HERE',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set this to true on production
    }
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionConfig.cookie.secure = true // serve secure cookies
}

app.use(session(sessionConfig));

// instantiate the wrapper
const authProvider = new msalWrapper.AuthProvider(config, cache);

// initialize the wrapper
app.use(authProvider.initialize());

// pass the instance to your routers
app.use(mainRouter(authProvider));

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));