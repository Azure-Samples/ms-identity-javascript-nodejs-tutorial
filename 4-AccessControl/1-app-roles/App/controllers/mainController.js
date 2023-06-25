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
        roles: account.idTokenClaims.roles ? account.idTokenClaims.roles.join(' ') : null
    };

    res.render('id', {isAuthenticated: req.authContext.isAuthenticated(), claims: claims});
}
