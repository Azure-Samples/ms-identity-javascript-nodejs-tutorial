const appSettings = {
    appCredentials: {
        clientId: "Enter_the_Application_Id_Here",
        tenantId: "Enter_the_Tenant_Info_Here",
        clientSecret: "Enter_the_Client_Secret_Here"
    },
    authRoutes: {
        redirect: "/redirect",
        error: "/error", // the wrapper will redirect to this route in case of any error
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt
    },
    protectedResources: {
        graphAPI: {
            endpoint: "https://graph.microsoft.com/v1.0/me",
            scopes: ["user.read"]
        },
        armAPI: {
            endpoint: "https://management.azure.com/tenants?api-version=2020-01-01",
            scopes: ["https://management.azure.com/user_impersonation"]
        }
    }
}

module.exports = appSettings;