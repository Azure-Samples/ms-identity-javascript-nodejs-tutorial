/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const msal = require('@azure/msal-node');
const { v4: uuidv4 } = require('uuid');

const auth = require('../../auth.json');

const msalConfig = {
    auth: {
        clientId: auth.credentials.clientId,
        authority: auth.policies.authorities.signUpSignIn.authority,
        knownAuthorities: [auth.policies.authorityDomain],
        clientSecret: auth.credentials.clientSecret,
        redirectUri: auth.configuration.redirectUri,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false, 
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

/**
 * Middleware here can be used with express sessions in route controllers
 * Session variables accessible are as follows:
 * 
 * req.session.isAuthenticated => true : false
 * req.session.isAuthorized => true : false
 * req.session.idTokenClaims => object {}
 * req.session.accessTokenClaims => object {}
 * req.session.account => object {}
 * req.session.idToken => string ""
 * req.session.accessToken => string ""
 */

// Create msal application object
const msalClient = new msal.ConfidentialClientApplication(msalConfig);

/** 
 * Request Configuration
 * We manipulate these two request objects below 
 * to acquire a token with the appropriate claims.
 */
const authCodeRequest = {
    redirectUri: msalConfig.auth.redirectUri,
};

const tokenRequest = {
    redirectUri: msalConfig.auth.redirectUri,
};

const APP_STATES = {
    login: "signin",
    logout: "signout",
    acquireToken: "acquireToken",
    signUpSignIn: "signUpSignIn",
    passwordReset: "passwordReset",
    editProfile: "editProfile",
}

const OIDC_SCOPES = ["openid", "profile"];

let nonce;

// ============ MIDDLEWARE =============

exports.signIn = (req, res, next) => {
    let state = null;

    if (authCodeRequest.state) {
        state = JSON.parse(base64DecodeUrl(authCodeRequest.state))
    }

    if (state) {
        if (state.stage === APP_STATES.passwordReset) {

            nonce = generateGuid();
    
            const state = base64EncodeUrl(JSON.stringify({
                stage: APP_STATES.passwordReset,
                path: req.route.path,
                nonce: nonce
            }));
    
            // if coming for password reset, set the authority to password reset
            getAuthCode(auth.policies.authorities.resetPassword.authority, OIDC_SCOPES, state, res);
        } else {
            // else, login as usual
    
            nonce = generateGuid();
    
            const state = base64EncodeUrl(JSON.stringify({
                stage: APP_STATES.login,
                path: req.route.path,
                nonce: nonce
            }))
    
            getAuthCode(auth.policies.authorities.signUpSignIn.authority, OIDC_SCOPES, state, res);
        }
    } else {
        nonce = generateGuid();
    
        const state = base64EncodeUrl(JSON.stringify({
            stage: APP_STATES.login,
            path: req.route.path,
            nonce: nonce
        }))

        getAuthCode(auth.policies.authorities.signUpSignIn.authority, OIDC_SCOPES, state, res);
    }
};

exports.editProfile = (req, res, next) => {
    nonce = generateGuid();

    const state = base64EncodeUrl(JSON.stringify({
        stage: APP_STATES.login,
        path: req.route.path,
        nonce: nonce
    }))

    getAuthCode(auth.policies.authorities.editProfile.authority, OIDC_SCOPES, state, res);
};

exports.handleRedirect = async(req, res, next) => {

    const state = JSON.parse(base64DecodeUrl(req.query.state))

    if (state.nonce === nonce) {
        if (state.stage === APP_STATES.login) {
            
            tokenRequest.scopes = OIDC_SCOPES;
            tokenRequest.code = req.query.code;
        
            msalClient.acquireTokenByCode(tokenRequest)
                .then((response) => {
                    console.log("\nResponse: \n:", response);
                    if (validateIdToken(response.idTokenClaims)) {
        
                        req.session.idTokenClaims = response.idTokenClaims;
                        req.session.isAuthenticated = true;
        
                        return res.status(200).redirect(auth.configuration.homePageRoute);
                    } else {
                        return res.status(401).redirect('/401.html');;
                    }
                }).catch((error) => {
                    console.log(req.query.error)
                    console.log(req.query.error_description)
                    console.log('hey1')
                    if (req.query.error) {
                        console.log('hey2')
                        /**
                         * When the user selects "forgot my password" on the sign-in page, B2C service will throw an error.
                         * We are to catch this error and redirect the user to login again with the resetPassword authority.
                         * For more information, visit: https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview#linking-user-flows
                         */
                        if (JSON.stringify(req.query.error_description).includes("AADB2C90118")) {
                            console.log('hey3')
                            nonce = generateGuid();

                            const state = base64EncodeUrl(JSON.stringify({
                                stage: APP_STATES.passwordReset,
                                path: req.route.path,
                                nonce: nonce
                            }))

                            authCodeRequest.authority = auth.policies.authorities.resetPassword.authority;
                            authCodeRequest.state = state;
                            return res.redirect('/signin');
                        }
                    }
                    res.status(500).send(error);
                });
        } else if (state.stage === APP_STATES.passwordReset) {

            // once the password is reset, redirect the user to login again with the new password
            nonce = generateGuid();
            
            const state = base64EncodeUrl(JSON.stringify({
                stage: APP_STATES.login,
                path: req.route.path,
                nonce: nonce
            }))

            authCodeRequest.state = state;

            res.redirect('/signin');
        } else {
            res.status(500).send("unknown");
        }
    } else {
        res.status(401).redirect('/401.html');
    }
};

exports.signOut = (req, res) => {

    const logoutURI = msalConfig.auth.authority + '/oauth2/v2.0/logout?post_logout_redirect_uri=' + auth.configuration.postLogoutRedirectUri;
    req.session.isAuthenticated = false;
    
    req.session.destroy(() => {
        res.redirect(logoutURI);
    });
};

exports.isAuthenticated = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/401.html');
    }
    next();
};


// ========= UTILITIES ============

/**
 * This method is used to generate an auth code request
 * @param {string} authority: the authority to request the auth code from 
 * @param {array} scopes: scopes to request the auth code for 
 * @param {object} state: state of the application
 * @param {object} res: express middleware response object
 */
const getAuthCode = (authority, scopes, state, res) => {

    // prepare the request
    authCodeRequest.authority = authority;
    authCodeRequest.scopes = scopes;
    console.log(state);
    authCodeRequest.state = state;

    tokenRequest.authority = authority;

    // request an authorization code to exchange for a token
    return msalClient.getAuthCodeUrl(authCodeRequest)
        .then((response) => {
            res.redirect(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
}

const validateIdToken = (idTokenClaims) => {
    const now = Math.round((new Date()).getTime() / 1000); // in UNIX format
    
    checkAudience = idTokenClaims["aud"] === auth.credentials.clientId ? true : false;
    checkTimestamp = idTokenClaims["iat"] < now && idTokenClaims["exp"] > now ? true: false;

    if (checkAudience && checkTimestamp) {
        return true;
    } else {
        return false;
    }
};

// ======== CRYPTO UTILS ==========

const base64Encode = (str, encoding) => {
    return Buffer.from(str, encoding).toString("base64");
}

const base64EncodeUrl = (str, encoding) => {
    return base64Encode(str, encoding)
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

const base64Decode = (base64Str) => {
    return Buffer.from(base64Str, "base64").toString("utf8");
}

const base64DecodeUrl = (base64Str) => {
    let str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) {
        str += "=";
    }
    return base64Decode(str);
}

const generateGuid = () => {
    return uuidv4();
}

const isGuid = (guid) => {
    const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regexGuid.test(guid);
}