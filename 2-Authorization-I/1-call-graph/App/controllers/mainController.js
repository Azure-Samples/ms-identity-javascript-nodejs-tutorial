exports.getHomePage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    res.render('home', { isAuthenticated: isAuthenticated });
}

exports.getIdPage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const claims = req.session.idTokenClaims;
    res.render('id', {isAuthenticated: isAuthenticated, claims: claims});
}

exports.getProfilePage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const profile = req.session.graphAPI["resourceResponse"]; // the name of your web API in auth.json
    res.render('profile', {isAuthenticated: isAuthenticated, profile: profile});
}

exports.getTenantPage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const tenant = req.session.armAPI["resourceResponse"]; // the name of your web API in auth.json
    res.render('tenant', {isAuthenticated: isAuthenticated, tenant: tenant.value[0]});
}