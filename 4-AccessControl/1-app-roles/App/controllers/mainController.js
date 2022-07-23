exports.getHomePage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const username = req.session.account ? req.session.account.username : '';
    res.render('home', { isAuthenticated: isAuthenticated, username: username });
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