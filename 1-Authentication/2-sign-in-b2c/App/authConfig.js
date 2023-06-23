const authConfig = {
    authOptions: {
        authority: "https://login.microsoftonline.com/Enter_the_Tenant_Info_Here",
        clientId: "Enter_the_Application_Id_Here",
        clientSecret: "Enter_the_Client_Secret_Here",
        redirectUri: "/redirect",
    },
    systemOptions: {
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