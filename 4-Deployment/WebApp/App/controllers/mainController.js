const fetchManager = require('../utils/fetchManager');
const appSettings = require('../../appSettings.json');

exports.getHomePage = (req, res, next) => {
    res.render('home', { isAuthenticated: req.session.isAuthenticated });
}

exports.getIdPage = (req, res, next) => {  
    const claims = {
        name: req.session.account.idTokenClaims.name,
        preferred_username: req.session.account.idTokenClaims.preferred_username,
        oid: req.session.account.idTokenClaims.oid,
        sub: req.session.account.idTokenClaims.sub
    };
    
    res.render('id', {isAuthenticated: req.session.isAuthenticated, claims: claims});
}

exports.getWebAPI = async (req, res, next) => {
    let apiResponse;

    try {
        apiResponse = await fetchManager.callAPI(appSettings.resources.webAPI.endpoint, req.session["webAPI"].accessToken);
    } catch (error) {
        console.log(error)
    }

    res.render('webapi', {isAuthenticated: req.session.isAuthenticated, response: apiResponse});
}