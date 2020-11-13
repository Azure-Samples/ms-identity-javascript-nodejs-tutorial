exports.getHomePage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    res.render('home', { isAuthenticated: isAuthenticated });
}

exports.getProfilePage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const profile = req.session.graphAPI["resourceResponse"]; // the name of your api in auth.json
    res.render('profile', {isAuthenticated: isAuthenticated, profile: profile});
}

exports.getIdPage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const claims = req.session.idTokenClaims;
    res.render('id', {isAuthenticated: isAuthenticated, claims: claims});
}
