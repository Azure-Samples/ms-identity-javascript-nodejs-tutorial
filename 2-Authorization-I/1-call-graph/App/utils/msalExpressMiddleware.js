/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const msal = require('@azure/msal-node');
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa');
const axios = require('axios');

const constants = require('./constants');
const CryptoUtilities = require('./CryptoUtilities'); 

/**
 * MSAL Express Middleware is a collection of middleware and utility methods
 * that enables integration of authentication with Express MVC applications
 * 
 * Middleware here can be used with express sessions in route controllers
 * Session variables accessible are as follows:
 * 
 * req.session.isAuthenticated => true : false
 * req.session.isAuthorized => true : false
 * req.session.idToken => string ""
 * req.session.idTokenClaims => object {}
 * req.session.account => object {}
 * req.session.resourceName.accessToken => string ""
 * req.session.resourceName.accessTokenClaims => object {}
 * req.session.resourceName.resourceResponse => object {}
 */
class MsalExpressMiddleware extends msal.ConfidentialClientApplication {

    nonce;
    rawConfig;
    msalConfig;

    /** 
     * Request Configuration
     * We manipulate these two request objects below 
     * to acquire a token with the appropriate claims
     */
    authCodeRequest = {
        authority: "",
        scopes: [],
        state: {},
        redirectUri: ""
    };

    tokenRequest = {
        authority: "",
        scopes: [],
        state: {},
        redirectUri: ""
    };
    
    constructor(config) {
        super(MsalExpressMiddleware.shapeConfiguration(config));
        if (!MsalExpressMiddleware.validateConfiguration(config)) {
            throw new Error("invalid configuration");  
        }
        this.rawConfig = config;
        this.msalConfig = MsalExpressMiddleware.shapeConfiguration(config);
        Object.assign(this, new msal.ConfidentialClientApplication(this.msalConfig));
    };

    /**
     * Validates the fields in the custom JSON configuration file
     * @param {JSON} config
     */
    static validateConfiguration = (config) => {
        return true;
    };

    /**
     * Maps the custom JSON configuration file to configuration
     * object exprected by MSAL Node
     * @param {JSON} config
     */
    static shapeConfiguration = (config) => {
        const msalConfig = {
            auth: {
                clientId: config.credentials.clientId,
                authority: constants.AuthorityStrings.AAD + config.credentials.tenantId,
                clientSecret: config.credentials.clientSecret,
                redirectUri: config.configuration.redirectUri
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
        return msalConfig;
    };

    // ========= MIDDLEWARE ===========

    /**
     * Initiate sign in flow
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    signIn = (req, res, next) => {
        this.nonce = CryptoUtilities.generateGuid();

        let state = CryptoUtilities.base64EncodeUrl(
            JSON.stringify({
                stage: constants.AppStages.SIGN_IN,
                path: req.route.path,
                nonce: this.nonce
            }), null);

        // get url to sign user in and consent to scopes needed for application
        this.getAuthCode(
            this.msalConfig.auth.authority, 
            Object.values(constants.OIDCScopes), 
            state, this.msalConfig.auth.redirectUri, res);
    };

    /**
     * Initiate sign out and cleans the session
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    signOut = (req, res) => {
        const logoutURI = `${this.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${this.rawConfig.configuration.postLogoutRedirectUri}`;
        req.session.isAuthenticated = false;
        
        req.session.destroy(() => {
            res.redirect(logoutURI);
        });
    };
    
    /**
     * Middleware that handles redirect depending on request state
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    handleRedirect = async(req, res, next) => {

        const state = JSON.parse(CryptoUtilities.base64DecodeUrl(req.query.state));

        if (state.nonce === this.nonce) {
            if (state.stage === constants.AppStages.SIGN_IN) {

                const tokenRequest = {
                    redirectUri: this.msalConfig.auth.redirectUri,
                    scopes: [constants.OIDCScopes.OPENID, constants.OIDCScopes.PROFILE],
                    code: req.query.code,
                };

                this.acquireTokenByCode(tokenRequest)
                    .then((response) => {
                        console.log("\nResponse: \n:", response);
            
                        if (this.validateIdToken(response.idTokenClaims)) {
            
                            req.session.idTokenClaims = response.idTokenClaims;
                            req.session.isAuthenticated = true;
            
                            // edit here if you would like to change redirect after successful login
                            return res.status(200).redirect(this.rawConfig.configuration.homePageRoute);
                        } else {
                            return res.status(401).redirect('/401.html');
                        }
                    }).catch((error) => {
                        console.log(error);
                        res.status(500).send(error);
                    });
            } else if (state.stage === constants.AppStages.ACQUIRE_TOKEN) {

                let resourceName = this.getResourceName(state.path);

                const tokenRequest = {
                    code: req.query.code,
                    scopes: this.rawConfig.resources[resourceName].scopes,
                    redirectUri: this.rawConfig.configuration.redirectUri,
                };

                this.acquireTokenByCode(tokenRequest)
                    .then((response) => {
                        console.log("\nResponse: \n:", response);
                        
                        req.session[resourceName] = {
                            accessToken: response.accessToken,
                        }

                        // call the web API
                        this.callAPI(this.rawConfig.resources[resourceName].endpoint, response.accessToken, (resourceResponse) => {
                            req.session[resourceName].resourceResponse = resourceResponse;
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
                res.status(401).redirect('/401.html');
            }
    };

    /**
     * Middleware that gets token and passes to next
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    getToken = (req, res, next) => {

        let resourceName = this.getResourceName(req.route.path);
        
        if (!req.session[resourceName]) {
            req.session[resourceName] = {
                accessToken: null,
                resourceResponse: null,
            };
        }

        if (!this.hasTokenForProtectedRoute(req.session, resourceName)) {
            this.nonce = CryptoUtilities.generateGuid();
            
            let state = CryptoUtilities.base64EncodeUrl(
                JSON.stringify({
                    stage: constants.AppStages.ACQUIRE_TOKEN,
                    path: req.route.path,
                    nonce: this.nonce
                }), null);

            let scopes = Object.values(this.rawConfig.resources).find(resource => resource.callingPageRoute === req.route.path).scopes;

            // initiate the first leg of auth code grant to get token
            this.getAuthCode(
                this.msalConfig.auth.authority, 
                scopes, state, this.msalConfig.auth.redirectUri, res
                );

        } else {
            next();
        }
    };

    /**
     * Middleware checks for id token (and redirects to get sign-in?)
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    isAuthenticated = (req, res, next) => {        
        if (!req.session.isAuthenticated) {
            return res.redirect('/401.html');
        }
        next();
    };

    /**
     * Middleware checks for access token (and redirects to get token?)
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    isAuthorized = (req, res, next) => {
        let resourceName = this.getResourceName(req.route.path);

        if (!req.session[resourceName]) {
            req.session[resourceName] = {
                accessToken: null,
                resourceResponse: null,
            };
        }
        
        if (!this.hasTokenForProtectedRoute(req.session, resourceName)) {
            return res.redirect('/401.html');
        }
        next();
    };

    // ============== UTILS ===============
    
    /**
     * Validates the id token for a set of claims
     * @param {Object} idTokenClaims: decoded id token claims
     */
    validateIdToken = (idTokenClaims) => {
        const now = Math.round((new Date()).getTime() / 1000); // in UNIX format
        
        const checkAudience = idTokenClaims["aud"] === this.msalConfig.auth.clientId ? true : false;
        const checkTenant = idTokenClaims["tid"] === this.rawConfig.credentials.tenantId ? true : false;
        const checkTimestamp = idTokenClaims["iat"] < now && idTokenClaims["exp"] > now ? true: false;
    
        if (checkAudience && checkTenant && checkTimestamp) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Validates the access token for signature 
     * and a given set of claims
     * @param {Object} token: raw access token
     */
    validateAccessToken = (accessToken) => {
    
        // TODO: claims validation logic
        // check scp
        // check audience
        // check issuer
        // check tid if allowed
        // check nonce replay
    
        const validationOptions = {
            audience: this.rawConfig.credentials.clientId,
        }
    
        // without verifying signature
        // var decoded = jwt.decode(accessToken, {complete: true});
    
        jwt.verify(accessToken, this.getSigningKeys, validationOptions, (err, payload) => {
            if (err) {
                console.log(err);
            }
            console.log(payload);
        });
    };
    
    /**
     * Fetches signing keys of an access token 
     * from the authority discovery endpoint
     * @param {String} header 
     * @param {Function} callback 
     */
    getSigningKeys = (header, callback) => {
        const client = jwksClient({
            jwksUri: 'https://login.microsoftonline.com/' + this.rawConfig.credentials.tenantId + '/discovery/v2.0/keys'
        });
    
        client.getSigningKey(header.kid, function (err, key) {

            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    };

    /**
     * this fetches the resource with axios
     * @param {String} endpoint: resource endpoiint
     * @param {String} accessToken: raw token 
     * @param {Function} callback: call after resource fetched
     */
    callAPI = (endpoint, accessToken, callback) => {
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
    
        console.log('request made to web API at: ' + new Date().toString());
    
        axios.default.get(endpoint, options)
            .then(response => callback(response.data))
            .catch(error => console.log(error));
    };

    /**
     * This method is used to generate an auth code request
     * @param {String} authority: the authority to request the auth code from 
     * @param {Array} scopes: scopes to request the auth code for 
     * @param {String} state: state of the application
     * @param {String} redirect: redirect URI
     * @param {Object} res: express middleware response object
     */
    getAuthCode = (authority, scopes, state, redirect, res) => {
        // prepare the request
        this.authCodeRequest.authority = authority;
        this.authCodeRequest.scopes = scopes;
        this.authCodeRequest.state = state;
        this.authCodeRequest.redirectUri = redirect;

        this.tokenRequest.authority = authority;

        // request an authorization code to exchange for a token
        return this.getAuthCodeUrl(this.authCodeRequest)
            .then((response) => {
                res.redirect(response);
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                res.status(500).send(error);
            });
    };

    /**
     * Checks if there is a token for that resource in the session
     * @param {Object} session: Express session object 
     * @param {String} resourceName: name of the resource from config file
     */
    hasTokenForProtectedRoute = (session, resourceName) => {
        if (!session[resourceName]["accessToken"]) {
            return false;
        }
        return true;
    }

    /**
     * Util method to get the resource name for a given callingPageRoute (auth.json)
     * @param {String} path 
     */
    getResourceName = (path) => {
        let index = Object.values(this.rawConfig.resources).findIndex(resource => resource.callingPageRoute === path);
        let resourceName = Object.keys(this.rawConfig.resources)[index];
        return resourceName;
    }

}

module.exports = MsalExpressMiddleware;