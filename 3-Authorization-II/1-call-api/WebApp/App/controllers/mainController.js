exports.getHomePage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    res.render('home', { isAuthenticated: isAuthenticated });
}

exports.getIdPage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const claims = req.session.idTokenClaims;
    res.render('id', {isAuthenticated: isAuthenticated, claims: claims});
}

exports.getWebAPI = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const claims = req.session.idTokenClaims;
    res.render('webapi', {isAuthenticated: isAuthenticated, claims: claims});
}