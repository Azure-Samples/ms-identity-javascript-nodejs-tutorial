const appSettings = {
    appCredentials: {
        clientId: "c5f4d666-c952-402b-8e3d-b005fae1ac64",
        tenantId: "775527ff-9a37-4307-8b3d-cc311f58d925",
        clientSecret: "c5zKd51Vlx3O48Q-B0_mr._SqBQm-xW.o5"
    },
    authRoutes: {
        redirect: "/redirect",
        error: "/error",
        unauthorized: "/unauthorized"
    },
    b2cPolicies: {
        signUpSignIn: {
            authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/B2C_1_susi_reset_v2"
        }
    }
}

module.exports = appSettings;