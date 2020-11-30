const express = require("express");

const SERVER_PORT = process.env.PORT || 5000;

const app = express();

const config = require('./auth.json');
const MsalNodeWrapper = require('MsalNodeWrapper/MsalNodeWrapper');

const msal = new MsalNodeWrapper(config);

// protected resource
app.get('/api', msal.isAuthorized, (req, res, next) => {
    // req.authInfo contains the decoded token info
    res.status(200).json({'name': req.authInfo['name']});
})

app.listen(SERVER_PORT, () => console.log(`Msal Node web API listening on port ${SERVER_PORT}!`))