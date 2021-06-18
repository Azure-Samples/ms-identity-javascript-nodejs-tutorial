exports.getHomePage = (req, res, next) => {
    res.render('home', { isAuthenticated: req.session.isAuthenticated });
}

exports.getIdPage = (req, res, next) => {
    const claims = {
        name: req.session.account.idTokenClaims.name,
        preferred_username: req.session.account.idTokenClaims.preferred_username,
        oid: req.session.account.idTokenClaims.oid,
        sub: req.session.account.idTokenClaims.sub,
        groups: req.session.account.idTokenClaims.groups ? req.session.account.idTokenClaims.groups.join(' ') : "Overage!"
    };

    res.render('id', { isAuthenticated: req.session.isAuthenticated, claims: claims });
}