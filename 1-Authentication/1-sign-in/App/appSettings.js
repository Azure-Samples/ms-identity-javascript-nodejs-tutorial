const appSettings = {
    appCredentials: {
        clientId: "Enter_the_Application_Id_Here",
        tenantId: "Enter_the_Tenant_Info_Here",
        clientSecret: "Enter_the_Client_Secret_Here"
    },
    authRoutes: {
        redirect: "/redirect",
        error: "/error",
        unauthorized: "/unauthorized"
    }
}

module.exports = appSettings;