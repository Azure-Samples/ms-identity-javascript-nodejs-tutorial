/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const msal = require('@azure/msal-node');
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const auth = require('../../auth.json');

const msalConfig = {
    auth: {
        clientId: auth.credentials.clientId,
        authority: "https://login.microsoftonline.com/" + auth.credentials.tenantId,
        clientSecret: auth.credentials.clientSecret
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

const APP_STATES = {
    login: "login",
    logout: "logout",
    acquireToken: "acquireToken"
}

const OIDC_SCOPES = ["openid", "profile", "offline_access"];

let nonce;

// ============ MIDDLEWARE =============

exports.signIn = (req, res, next) => {

    nonce = generateGuid();

    const authCodeUrlParameters = {
        redirectUri: auth.configuration.redirectUri,
        scopes: OIDC_SCOPES,
        state: base64EncodeUrl(JSON.stringify({
            stage: APP_STATES.login,
            path: req.route.path,
            nonce: nonce
        }))
    };

    // get url to sign user in and consent to scopes needed for application
    msalClient.getAuthCodeUrl(authCodeUrlParameters)
        .then((response) => {
            res.redirect(response);
        }).catch((error) => {
            console.log(JSON.stringify(error));
        });
};

exports.handleRedirect = async(req, res, next) => {
    console.log(req.query.state)
    const state = JSON.parse(base64DecodeUrl(req.query.state))

    if (state.nonce === nonce) {
        if (state.stage === APP_STATES.login) {
            const tokenRequest = {
                redirectUri: auth.configuration.redirectUri,
                scopes: OIDC_SCOPES,
                code: req.query.code,
            };
        
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
                    console.log(error);
                    res.status(500).send(error);
                });
        } else if (state.stage === APP_STATES.acquireToken) {
            
            const tokenRequest = {
                code: req.query.code,
                scopes: auth.resources.graphAPI.scopes,
                redirectUri: auth.configuration.redirectUri,
            };
    
            msalClient.acquireTokenByCode(tokenRequest)
                .then((response) => {
    
                    // store access token somewhere
                    validateAccessToken(response.accessToken)
                    req.session.graphToken = response.accessToken;
    
                    // call the web API
                    callAPI(auth.resources.graphAPI.endpoint, response.accessToken, (graphResponse) => {
                        req.session.graphResponse = graphResponse;
                        return res.status(200).redirect(state.path);
                    });
                    
                }).catch((error) => {
                    console.log(error);
                    res.status(500).send(error);
                });
        } else {
            res.status(500).send("unknown");
        }
    } else {
        console.log(state.nonce);
        console.log(nonce);
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

exports.getToken = (req, res, next) => {
    if (!req.session.graphToken) {
        
        nonce = generateGuid();

        const authCodeUrlParameters = {
            redirectUri: auth.configuration.redirectUri,
            scopes: auth.resources.graphAPI.scopes,
            state: base64EncodeUrl(JSON.stringify({
                stage: APP_STATES.acquireToken,
                path: req.route.path,
                nonce: nonce
            })) 
        };
    
        // get url to sign user in and consent to scopes needed for application
        msalClient.getAuthCodeUrl(authCodeUrlParameters)
            .then((response) => {
                return res.redirect(response);
            }).catch((error) => {
                console.log(JSON.stringify(error));
                return res.status(500).send(JSON.stringify(error));
            });
    } else {
        next();
    }
};

exports.isAuthenticated = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/401.html');
    }
    next();
};

exports.isAuthorized = (req, res, next) => {
    if (!req.session.graphToken) {
        return res.redirect('/401.html');
    }
    next();
}

// ========= UTILITIES ============

const validateIdToken = (idTokenClaims) => {
    const now = Math.round((new Date()).getTime() / 1000); // in UNIX format
    
    checkAudience = idTokenClaims["aud"] === auth.credentials.clientId ? true : false;
    checkTenant = idTokenClaims["tid"] === auth.credentials.tenantId ? true : false;
    checkTimestamp = idTokenClaims["iat"] < now && idTokenClaims["exp"] > now ? true: false;

    if (checkAudience && checkTenant && checkTimestamp) {
        return true;
    } else {
        return false;
    }
};

const validateAccessToken = (token) => {
    console.log(token);

    // TODO: claims validation logic
    // check scp
    // check audience
    // check issuer
    // check tid if allowed
    // check nonce replay

    const validationOptions = {
        audience: auth.credentials.clientId,
    }

    // without verifying signature
    // var decoded = jwt.decode(token, {complete: true});

    jwt.verify(token, getSigningKeys, validationOptions, (err, payload) => {
        if (err) {
            console.log(err);
        }
        console.log(payload);
    });
};

const getSigningKeys = (header, callback) => {
    const client = jwksClient({
        jwksUri: 'https://login.microsoftonline.com/' + auth.credentials.tenantId + '/discovery/v2.0/keys'
    });

    client.getSigningKey(header.kid, function (err, key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
};

const callAPI = (endpoint, accessToken, callback) => {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    axios.default.get(endpoint, options)
        .then(response => callback(response.data))
        .catch(error => console.log(error));
}

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