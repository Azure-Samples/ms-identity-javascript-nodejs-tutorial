// Importing from key vault
const keyVaultUri = process.env["KEY_VAULT_URI"];
const secretName = process.env["SECRET_NAME"];

const appSettings = {
    appCredentials: {
        clientId: "Enter_the_Application_Id_Here",
        tenantId: "Enter_the_Tenant_Info_Here",
        keyVaultCredential: {
            credentialType: "",
            credentialName: "",
            keyVaultUrl: "",
        }
    },
    authRoutes: {
        redirect: "/redirect",
        error: "/error",
        unauthorized: "/unauthorized"
    },
    remoteResources: {
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
