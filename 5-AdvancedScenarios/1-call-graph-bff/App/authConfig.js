/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const msal = require('@azure/msal-node');


const msalConfig = {
    auth: {
        clientId: 'Enter_the_Application_Id_Here',
        authority: 'https://login.microsoftonline.com/Enter_the_Tenant_Id_Here',
        clientSecret: 'Enter_the_Client_Secret_Here',
        redirectUri: 'http://localhost:3000/auth/redirect',
        clientCapabilities: ['CP1'],
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Info,
        },
    },
};

module.exports = msalConfig;