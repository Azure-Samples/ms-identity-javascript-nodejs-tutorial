const appSettings = {
    appCredentials: {
        clientId: "3ac2e4be-0740-4c63-8a09-4f7fb56ac979",
        tenantId: "cbaf2168-de14-4c72-9d88-f5f05366dbef",
        clientSecret: "2Cx7Q~vsiBXOEI9XfzDQ-vtNZQNMzMDBXE.iE"
    },
    authRoutes: {
        redirect: "/redirect",
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
}

module.exports = appSettings;