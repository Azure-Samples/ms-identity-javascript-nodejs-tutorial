const getGraphClient = require('../utils/graphClient');
const { handleAnyClaimsChallenge, setClaims } = require('../utils/claimUtils');

const {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
    GRAPH_ME_ENDPOINT
} = require('../authConfig');

const AuthProvider = require("../auth/AuthProvider");

const authProvider = new AuthProvider({
    msalConfig: msalConfig,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
});

exports.loginUser = async (req, res, next) => {
    let postLoginRedirectUri;
    let scopesToConsent;

    if (req.query && req.query.postLoginRedirectUri) {
        postLoginRedirectUri = decodeURIComponent(req.query.postLoginRedirectUri);
    }

    if (req.query && req.query.scopesToConsent) {
        scopesToConsent = decodeURIComponent(req.query.scopesToConsent);
    }

    return authProvider.login(req, res, next, { postLoginRedirectUri, scopesToConsent });
}

exports.handleRedirect = async (req, res, next) => {
    return authProvider.handleRedirect(req, res, next);
}

exports.logoutUser = async (req, res, next) => {
    return authProvider.logout(req, res, next);
}

exports.getAccount = async (req, res, next) => {
    const account = authProvider.getAccount(req, res, next);
    res.status(200).json(account);
}

exports.getProfile = async (req, res, next) => {
    if (!authProvider.isAuthenticated(req, res, next)) {
        return res.status(401).json({ error: 'unauthorized' });
    }

    try {
        const tokenResponse = await authProvider.acquireToken(req, res, next, { scopes: ['User.Read']});
        const graphResponse = await getGraphClient(tokenResponse.accessToken).api('/me').responseType('raw').get();
        const graphData = await handleAnyClaimsChallenge(graphResponse);

        res.status(200).json(graphData);
    } catch (error) {
        if (error.name === 'ClaimsChallengeAuthError') {
            setClaims(req.session, msalConfig.auth.clientId, GRAPH_ME_ENDPOINT, error.payload);
            return res.status(401).json({ error: error.name });
        }

        if (error.name === 'InteractionRequiredAuthError') {
            return res.status(401).json({ error: error.name, scopes: error.payload });
        }

        next(error);
    }
}