const authConfig = {
    authOptions: {
        authority: "https://login.microsoftonline.com/cbaf2168-de14-4c72-9d88-f5f05366dbef/",
        clientId: "82e01ead-82f8-4ec4-9c82-fea5347c33b2",
        clientSecret: "yLl8Q~ssTFDlNRu~-PfrLwf32XCwEaVhyjJJhcov",
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
}

module.exports = authConfig;