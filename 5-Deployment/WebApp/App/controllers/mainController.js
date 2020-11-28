exports.getHomePage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    res.render('home', { isAuthenticated: isAuthenticated });
}

exports.getIdPage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    
    const claims = {
        name: req.session.idTokenClaims.name,
        preferred_username: req.session.idTokenClaims.preferred_username,
        oid: req.session.idTokenClaims.oid,
        sub: req.session.idTokenClaims.sub
    };
    
    res.render('id', {isAuthenticated: isAuthenticated, claims: claims});
}

exports.getWebAPI = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const response = req.session.webAPI["resourceResponse"];
    res.render('webapi', {isAuthenticated: isAuthenticated, response: response});
}