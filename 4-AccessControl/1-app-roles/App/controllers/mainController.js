exports.getHomePage = (req, res, next) => {
    res.render('home', { isAuthenticated: req.session.isAuthenticated });
}

exports.getIdPage = (req, res, next) => {
    const claims = {
        name: req.session.account.idTokenClaims.name,
        preferred_username: req.session.account.idTokenClaims.preferred_username,
        oid: req.session.account.idTokenClaims.oid,
        sub: req.session.account.idTokenClaims.sub,
        roles: req.session.account.idTokenClaims.roles ? req.session.account.idTokenClaims.roles.join(' ') : null
    };

    res.render('id', { isAuthenticated: req.session.isAuthenticated, claims: claims });
}