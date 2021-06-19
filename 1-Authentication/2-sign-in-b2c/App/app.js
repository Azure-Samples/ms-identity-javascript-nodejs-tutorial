/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express');
const session = require('express-session');
const path = require('path');

const msalWrapper = require('msal-express-wrapper');
const config = require('./appSettings.js');
const cache = require('./utils/cachePlugin');

const mainController = require('./controllers/mainController');

const SERVER_PORT = process.env.PORT || 4000;

// initialize express
const app = express(); 

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use(express.static(path.join(__dirname, './public')));

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

// app routes
app.get('/', (req, res) => res.redirect('/home'));
app.get('/home', mainController.getHomePage);

// authentication routes
app.get('/signin', 
    authProvider.signIn({
        successRedirect: '/'
    }
));

app.get('/signout', 
    authProvider.signOut({
        successRedirect: '/'
    }
));

// secure routes
app.get('/id', 
    authProvider.isAuthenticated(), 
    mainController.getIdPage
);

// unauthorized
app.get('/error', (req, res) => res.redirect('/500.html'));

// error
app.get('/unauthorized', (req, res) => res.redirect('/401.html'));

// 404
app.get('*', (req, res) => res.status(404).redirect('/404.html'));

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));