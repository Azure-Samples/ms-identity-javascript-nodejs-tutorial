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
        groups: account.idTokenClaims.groups ? account.idTokenClaims.groups.join(' ') : "A groups overage has occurred. To learn more about how to handle group overages, please visit https://learn.microsoft.com/azure/active-directory/develop/id-token-claims-reference#groups-overage-claim"
    };

    res.render('id', {isAuthenticated: req.authContext.isAuthenticated(), claims: claims});
}
