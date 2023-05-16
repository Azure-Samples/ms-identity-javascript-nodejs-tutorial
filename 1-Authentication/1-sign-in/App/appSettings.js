/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const appSettings = {
    authOptions: {
        clientId: 'Enter_the_Application_Id_Here',
        tenantId: 'Enter_the_Application_Id_Here',
        clientSecret: 'Enter_the_Application_Id_Here',
    },
    authRoutes: {
        redirectUri: '/redirect',
    },
    loggerOptions: {
        loggerCallback: (logLevel, message, containsPii) => {
            if (containsPii) {
                return;
            }
            console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: 3,
    },
};

module.exports = appSettings;
