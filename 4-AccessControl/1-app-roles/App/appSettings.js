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
    },
    accessMatrix: {
        todolist: {
            methods: ["GET", "POST", "DELETE"],
            roles: ["TaskUser", "TaskAdmin"]
        },
        dashboard: {
            methods: ["GET"],
            roles: ["TaskAdmin"]
        }
    }
}

module.exports = appSettings;