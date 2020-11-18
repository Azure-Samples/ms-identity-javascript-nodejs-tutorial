const express = require("express");

const SERVER_PORT = process.env.PORT || 5000;

const app = express();

const MsalExpressMiddleware = require('../../../MsalNodeCommons/MsalExpressMiddleware');
const auth = require('./auth.json');

const msal = new MsalExpressMiddleware(auth);

// protected route
app.get('/api', msal.isAuthorized, (req, res, next) => {
    res.status(200).json({'name': req.authInfo['name']});
})

app.listen(SERVER_PORT, () => console.log(`Msal Node Web API listening on port ${SERVER_PORT}!`))