const fetchManager = require('../utils/fetchManager');
const graphManager = require('../utils/graphManager');

exports.getHomePage = (req, res, next) => {
    const username = req.authContext.getAccount() ? req.authContext.getAccount().username : '';
    res.render('home', { isAuthenticated: req.authContext.isAuthenticated(), username: username });
}

exports.getIdPage = (req, res, next) => {
    const account = req.authContext.getAccount();

    const claims = {
        name: account.idTokenClaims.name,
        preferred_username: account.idTokenClaims.preferred_username,
        oid: account.idTokenClaims.oid,
        sub: account.idTokenClaims.sub
    };

    res.render('id', {isAuthenticated: req.authContext.isAuthenticated(), claims: claims});
}

exports.getProfilePage = async (req, res, next) => {
    try {
        /**
         * If you have configured your authenticate middleware accordingly, you should be 
         * able to get the access token for the Microsoft Graph API from the cache. If not, 
         * you will need to acquire and cache the token yourself.
         */
        let accessToken = req.authContext.getCachedTokenForResource("graph.microsoft.com");

        if (!accessToken) {

            /**
             * You can acquire a token for the Microsoft Graph API as shown below. Note that
             * if an interaction required error is thrown, you need to catch it and pass it 
             * to the interactionErrorHandler middleware.
             */
            const tokenResponse = await req.authContext.acquireToken({
                scopes: ["User.Read"],
                account: req.authContext.getAccount(),
            })(req, res, next);

            accessToken = tokenResponse.accessToken;
        }

        const graphClient = graphManager.getAuthenticatedClient(accessToken);

        const profile = await graphClient
            .api('/me')
            .get();

        res.render('profile', { isAuthenticated: req.authContext.isAuthenticated(), profile: profile });
    } catch (error) {
        // pass error to error middleware for handling
        next(error);
    }
}

exports.getTenantPage = async (req, res, next) => {
    try {
        const tokenResponse = await req.authContext.acquireToken({
            scopes: ["https://management.azure.com/user_impersonation"],
            account: req.authContext.getAccount(),
        })(req, res, next);

        const tenant = await fetchManager.callAPI("https://management.azure.com/tenants?api-version=2020-01-01", tokenResponse.accessToken);
        res.render('tenant', { isAuthenticated: req.authContext.isAuthenticated(), tenant: tenant.value[0] });
    } catch (error) {
        next(error);
    }
}