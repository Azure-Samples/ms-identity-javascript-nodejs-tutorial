const msal = require('@azure/msal-node');
const getGraphClient = require('../utils/graphClient');
const msalWrapper =  require("../msal");
const { handleClaimsChallenge, setClaims } = require('../utils/claimUtils');
const { msalConfig, GRAPH_ME_ENDPOINT } = require('../authConfig');



exports.loginUser = async (req, res, next) => {
    try {
        const response = await msalWrapper.login(req, res, next);
        res.redirect(response);
    } catch (error) {
        next(error)
    }    
}

exports.handleRedirect = async (req, res, next) => {
    try {
        const response = await msalWrapper.handleRedirect(req, res, next)
        res.redirect(response.redirectTo);
    } catch (error) {
        next(error)
    }
}

exports.logoutUser = async (req, res, next) => {
    msalWrapper.logout(req, res, next);
}

exports.isAuthenticated = async (req, res, next) => {
    if (msalWrapper.isAuthenticated(req, res, next)) {
        const account = await msalWrapper.getAccount(req, res, next);
        res.status(200).json(account);
    } else {
        res.status(200).json(null);
    }
}

exports.profile = async (req, res, next) => {
    try {
        const tokenResponse = await msalWrapper.acquireToken(req, res, next);
        const graphResponse = await getGraphClient(tokenResponse.accessToken).api('/me').responseType('raw').get();
        const graphData = await handleClaimsChallenge(graphResponse);
        if (graphData && graphData.errorMessage === 'claims_challenge_occurred') {
            throw graphData;
        }
        res.status(200).json(graphData);
    } catch(error) { 
        if (error instanceof msal.InteractionRequiredAuthError) {
            console.log(error)
        } else if (error.message === 'claims_challenge_occurred') {
            setClaims(req, msalConfig.auth.clientId, GRAPH_ME_ENDPOINT, error.payload);
            res.status(401).json({ error: error.errorMessage });
        } else {
            next(error);
        }
    }
}

