const msalInstance = require("../msal");
const msal = require('@azure/msal-node');
const getGraphClient = require('../utils/graphClient');



exports.loginUser = async (req, res, next) => {
    try {
        const cryptoProvider = new msal.CryptoProvider();
        const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

        if (!req.session.pkceCodes) {
            req.session.pkceCodes = {
                challengeMethod: 'S256',
            };
        }

        // Set generated PKCE Codes as session vars
        req.session.pkceCodes.verifier = verifier;
        req.session.pkceCodes.challenge = challenge;

        const authCodeUrlParameters = {
            redirectUri: 'http://localhost:4000/auth/redirect',
            responseMode: 'form_post',
            scopes: ['User.Read'],
            codeChallenge: req.session.pkceCodes.challenge,
            codeChallengeMethod: req.session.pkceCodes.challengeMethod,
        };

        const response = await msalInstance.getAuthCodeUrl(authCodeUrlParameters);
        res.redirect(response);
    } catch (error) {
        console.log(error)
    }    
}

exports.handleRedirect = async (req, res, next) => {
    try {
        const tokenRequest = {
            code: req.body.code,
            scopes: ['user.read'],
            redirectUri: 'http://localhost:4000/auth/redirect',
            codeVerifier: req.session.pkceCodes.verifier, // PKCE Code Verifier
        };
        const tokenResponse = await msalInstance.acquireTokenByCode(tokenRequest);
        req.session.account = tokenResponse.account;
        req.session.accessToken = tokenResponse.accessToken;
        res.redirect('http://localhost:4000');
    }  catch(error) {
        console.log(error)
    }

}

exports.logoutUser = async (req, res, next) => {
    req.session.destroy();
    res.redirect(
        `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:4000/`
    );
}

exports.isAuthenticated = (req, res, next) => {
    if(req.session.account) {
        res.status(200).json(req.session.account);
    }else {
        res.status(200).json(null)
    }
}

exports.profile = async (req, res, next) => {
    try {
        const tokenRequest = {
            scopes: ['user.read'],
            account: req.session.account,
        };

        const tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
        const graphResponse = await getGraphClient(tokenResponse.accessToken).api('/me').responseType('raw').get();
        const graphData = await graphResponse.json();
        res.status(200).json(graphData);
    } catch(error) { 
        if(msal.InteractionRequiredAuthError){
            res.redirect("/auth/login")
        }
        console.log(error)
    }
}

