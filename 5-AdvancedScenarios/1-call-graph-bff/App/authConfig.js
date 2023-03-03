/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const msal = require('@azure/msal-node');
const fs = require("fs");

const REDIRECT_URI = "http://localhost:4000/auth/redirect";
const POST_LOGOUT_REDIRECT_URI = "http://localhost:4000";
const GRAPH_ME_ENDPOINT = "https://graph.microsoft.com/v1.0/me";

const SESSION_COOKIE_NAME = "msid.sample.session";
const STATE_COOKIE_NAME = "msid.sample.state";

const msalConfig = {
    auth: {
        clientId: 'Enter_the_Application_Id_Here',
        authority: 'https://login.microsoftonline.com/Enter_the_Tenant_Id_Here',
        clientSecret: 'Enter_the_Client_Secret_Here',
        // clientCertificate: {
        //     thumbprint: 'YOUR_CERT_THUMBPRINT', // replace with thumbprint obtained during step 2 above
        //     privateKey: fs.readFileSync('PATH_TO_YOUR_PRIVATE_KEY_FILE'), // e.g. c:/Users/diego/Desktop/example.key
        // },
        clientCapabilities: ['CP1'], // this let's the resource know this client is capable of handling claims challenges
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        },
    },
};

module.exports = {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
    GRAPH_ME_ENDPOINT,
    SESSION_COOKIE_NAME,
    STATE_COOKIE_NAME,
};
