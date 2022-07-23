exports.getHomePage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const username = req.session.account ? req.session.account.username : '';
    res.render('home', { isAuthenticated: isAuthenticated, username: username });
}

exports.getIdPage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;

    const claims = {
        name: req.session.account.idTokenClaims.name,
        preferred_username: req.session.account.idTokenClaims.preferred_username,
        oid: req.session.account.idTokenClaims.oid,
        sub: req.session.account.idTokenClaims.sub
    };

    res.render('id', {isAuthenticated: isAuthenticated, claims: claims});
}
