const appSettings = {
    appCredentials: {
        clientId: "Enter_the_Application_Id_Here",
        tenantInfo: "Enter_the_Tenant_Info_Here",
        clientSecret: "Enter_the_Client_Secret_Here"
    },
    authRoutes: {
        redirect: "/redirect",
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
}

module.exports = appSettings;