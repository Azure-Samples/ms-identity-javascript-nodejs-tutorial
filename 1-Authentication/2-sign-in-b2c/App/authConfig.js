/**
 * For enhanced security, consider using client certificates instead of secrets.
 * See README-use-certificate.md for more.
 */
const authConfig = {
    auth: {
        authority: 'https://Enter_the_B2C_Tenant_Subdomain_Here.b2clogin.com/Enter_the_B2C_Tenant_Subdomain_Here.onmicrosoft.com/Enter_the_Policy_Name_Here',
        clientId: "Enter_the_Application_Id_Here",
        clientSecret: "Enter_the_Client_Secret_Here",
        // clientCertificate: {
        //     thumbprint: "YOUR_CERT_THUMBPRINT",
        //     privateKey: fs.readFileSync('PATH_TO_YOUR_PRIVATE_KEY_FILE'),
        // }
        redirectUri: "/redirect",
        knownAuthorities: ["Enter_the_B2C_Tenant_Subdomain_Here.b2clogin.com"],
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