const appSettings = require('../appSettings');
const fetchManager = require('../utils/fetchManager');
const graphManager = require('../utils/graphManager');

exports.getHomePage = (req, res, next) => {
    res.render('home', { isAuthenticated: req.session.isAuthenticated });
}

exports.getIdPage = (req, res, next) => {
    const claims = {
        name: req.session.account.idTokenClaims.name,
        preferred_username: req.session.account.idTokenClaims.preferred_username,
        oid: req.session.account.idTokenClaims.oid,
        sub: req.session.account.idTokenClaims.sub
    };

    res.render('id', { isAuthenticated: req.session.isAuthenticated, claims: claims });
}

exports.getProfilePage = async (req, res, next) => {
    let profile;

    try {
        const graphClient = graphManager.getAuthenticatedClient(req.session.protectedResources["graphAPI"].accessToken);

        profile = await graphClient
            .api('/me')
            .get();

    } catch (error) {
        console.log(error)
        next(error);
    }

    res.render('profile', { isAuthenticated: req.session.isAuthenticated, profile: profile });
}

exports.getTenantPage = async (req, res, next) => {
    let tenant;

    try {
        tenant = await fetchManager.callAPI(appSettings.protectedResources.armAPI.endpoint, req.session.protectedResources["armAPI"].accessToken);
    } catch (error) {
        console.log(error)
        next(error);
    }

    res.render('tenant', { isAuthenticated: req.session.isAuthenticated, tenant: tenant.value[0] });
}