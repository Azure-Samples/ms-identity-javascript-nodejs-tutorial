const appSettings = {
    appCredentials: {
        clientId: "Enter_the_Application_Id_Here",
        tenantId: "Enter_the_Tenant_Info_Here",
        clientSecret: "Enter_the_Client_Secret_Here"
    },
    authRoutes: {
        redirect: "/redirect",
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt
    },
    b2cPolicies: {
        signUpSignIn: {
            // the first policy under b2cPolicies will be used as default authority
            authority: "ENTER_YOUR_SIGN_IN_POLICY" // e.g. https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/B2C_1_susi_reset_v2
        }
    }
}

module.exports = appSettings;