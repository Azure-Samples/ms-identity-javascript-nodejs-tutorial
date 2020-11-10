exports.getHomePage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    res.render('home', { isAuthenticated: isAuthenticated });
}

exports.getProfile = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const claims = req.session.idTokenClaims;

    res.render('profile', {isAuthenticated: isAuthenticated, claims: claims});
}
