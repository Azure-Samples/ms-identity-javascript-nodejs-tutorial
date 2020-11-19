/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const router = require('./routes/router');

const SERVER_PORT = process.env.PORT || 4000;

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, './public')));

app.use(session({secret: 'your-secret', resave: false, saveUninitialized: false}));

app.use(router);

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));