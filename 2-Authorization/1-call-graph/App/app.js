/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const bodyParser = require('body-parser');
const path = require('path');

const mongoDB = require('./database/mongoDB');

const router = require('./routes/router');

const SERVER_PORT = process.env.PORT || 5000;

const app = express();

const sessionStore = new MongoDBStore({
    uri: mongoDB.CONNECTION_STRING,
    databaseName: 'test',
    collection: 'sessions'
});

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, './public')));

app.use(session({secret: 'vancouver', resave: false, saveUninitialized: false, store: sessionStore}));

app.use(router);

mongoDB.mongoConnect(() => {
    app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
});