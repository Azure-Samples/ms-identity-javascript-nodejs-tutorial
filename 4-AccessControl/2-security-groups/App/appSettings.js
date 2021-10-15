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
    accessMatrix: {
        todolist: {
            methods: ["GET", "POST", "DELETE"],
            groups: ["Enter_the_ObjectId_of_GroupAdmin", "Enter_the_ObjectId_of_GroupMember"]
        },
        dashboard: {
            methods: ["GET"],
            groups: ["Enter_the_ObjectId_of_GroupAdmin"]
        }
    }
}

module.exports = appSettings
