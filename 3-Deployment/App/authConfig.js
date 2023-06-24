const authConfig = {
    auth: {
        authority: "https://login.microsoftonline.com/Enter_the_Tenant_Info_Here",
        clientId: "Enter_the_Application_Id_Here",
        redirectUri: "/redirect",
    },
    system: {
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
    }
};

module.exports = authConfig;