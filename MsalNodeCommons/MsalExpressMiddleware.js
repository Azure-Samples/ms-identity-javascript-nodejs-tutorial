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
 * req.session.isAuthenticated => boolean
 * req.session.isAuthorized => boolean
 * req.session.idTokenClaims => object
 * req.session.account => object
 * req.session.resourceName.resourceResponse => object
 */
class MsalExpressMiddleware extends msal.ConfidentialClientApplication {

    nonce;
    rawConfig;
    msalConfig;
    homeAccountId;

    /** 
     * Request Configuration
     * We manipulate these three request objects below 
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

    silentRequest = {
        account: {},
        scopes: [],
        state: "",
    }
    
    constructor(config, cache = null) {
        super(MsalExpressMiddleware.shapeConfiguration(config, cache));

        if (!MsalExpressMiddleware.validateConfiguration(config)) {
            throw new Error("invalid configuration");  
        }

        this.rawConfig = config;
        this.msalConfig = MsalExpressMiddleware.shapeConfiguration(config, cache);
        Object.assign(this, new msal.ConfidentialClientApplication(this.msalConfig));
    };

    /**
     * Validates the fields in the custom JSON configuration file
     * @param {JSON} config
     */
    static validateConfiguration = (config) => {
        return config.credentials !== undefined &&
        config.credentials.clientId !== undefined && 
        config.credentials.tenantId !== undefined &&
        config.credentials.clientSecret !== undefined;
    };

    /**
     * Maps the custom JSON configuration file to configuration
     * object expected by MSAL Node
     * @param {JSON} config
     */
    static shapeConfiguration = (config, cachePlugin) => {
        const msalConfig = {
            auth: {
                clientId: config.credentials.clientId,
                authority: config.hasOwnProperty('policies') ? config.policies.authorities.signUpSignIn.authority : constants.AuthorityStrings.AAD + config.credentials.tenantId,
                clientSecret: config.credentials.clientSecret,
                redirectUri: config.hasOwnProperty('configuration') ? config.configuration.redirectUri : "",
                knownAuthorities: config.hasOwnProperty('policies') ? [config.policies.authorityDomain] : [],
            },
            cache: {
                cachePlugin,
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

        const state = Object.keys(this.authCodeRequest.state).length !== 0 ? 
            JSON.parse(CryptoUtilities.base64DecodeUrl(this.authCodeRequest.state)) : null;

        if (state && state.stage === constants.AppStages.RESET_PASSWORD) {
            let state = CryptoUtilities.base64EncodeUrl(
                JSON.stringify({
                    stage: constants.AppStages.RESET_PASSWORD,
                    path: req.route.path,
                    nonce: this.nonce
                }), null);
    
            // if coming for password reset, set the authority to password reset
            this.getAuthCode(
                this.rawConfig.policies.authorities.resetPassword.authority, 
                Object.values(constants.OIDCScopes), 
                state, 
                this.msalConfig.auth.redirectUri,
                res
            );

        } else {
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
                state, 
                this.msalConfig.auth.redirectUri, 
                res
            );
        }
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
                            
                            this.homeAccountId = response.account.homeAccountId;
                            req.session.idTokenClaims = response.idTokenClaims;
                            req.session.isAuthenticated = true;
            
                            return res.status(200).redirect(this.rawConfig.configuration.homePageRoute);
                        } else {
                            return res.status(401).send("Not Permitted");
                        }
                    }).catch((error) => {
                        if (req.query.error) {
                            /**
                             * When the user selects "forgot my password" on the sign-in page, B2C service will throw an error.
                             * We are to catch this error and redirect the user to login again with the resetPassword authority.
                             * For more information, visit: https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview#linking-user-flows
                             */
                            if (JSON.stringify(req.query.error_description).includes("AADB2C90118")) {

                                this.nonce = CryptoUtilities.generateGuid();

                                let interimState = CryptoUtilities.base64EncodeUrl(
                                    JSON.stringify({
                                        stage: constants.AppStages.RESET_PASSWORD,
                                        path: req.route.path,
                                        nonce: this.nonce
                                    }), null);

                                this.authCodeRequest.state = interimState;
                                this.authCodeRequest.authority = this.rawConfig.policies.authorities.resetPassword.authority;

                                return res.redirect(state.path);
                            }
                        }
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

                        // call the web API
                        this.callAPI(this.rawConfig.resources[resourceName].endpoint, response.accessToken, (resourceResponse) => {
                            req.session[resourceName].resourceResponse = resourceResponse;
                            return res.status(200).redirect(state.path);
                        });
                        
                    }).catch((error) => {
                        console.log(error);
                        res.status(500).send(error);
                    });
            } else if (state.stage === constants.AppStages.RESET_PASSWORD) {

                // once the password is reset, redirect the user to login again with the new password
                this.nonce = CryptoUtilities.generateGuid();
                
                let interimState = CryptoUtilities.base64EncodeUrl(
                    JSON.stringify({
                        stage: constants.AppStages.SIGN_IN,
                        path: req.route.path,
                        nonce: this.nonce
                    }), null);

                this.authCodeRequest.state = interimState;

                res.redirect(state.path);
            } else {
                res.status(500).send("Unknown app stage");
            }
        } else {
                res.status(401).send("Not Permitted");
        }
    };

    /**
     * Middleware that gets token and passes to next
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    getToken = async(req, res, next) => {

        let scopes = Object.values(this.rawConfig.resources)
            .find(resource => resource.callingPageRoute === req.route.path).scopes;

        let resourceName = this.getResourceName(req.route.path);
        
        if (!req.session[resourceName]) {
            req.session[resourceName] = {
                resourceResponse: null,
            };
        }

        // find account using homeAccountId built after receiving token response
        let account = await this.getTokenCache().getAccountByHomeId(this.homeAccountId);


        // build silent request
        const silentRequest = {
            account: account,
            scopes: scopes,
        };

        // acquire token silently to be used in resource call
        this.acquireTokenSilent(silentRequest)
            .then((response) => {
                console.log("\nSuccessful silent token acquisition:\nResponse: \n:", response);

                // call the web API
                this.callAPI(this.rawConfig.resources[resourceName].endpoint, response.accessToken, (resourceResponse) => {
                    req.session[resourceName].resourceResponse = resourceResponse;
                    return next()
                });
            })
            .catch((error) => {

                // in case there are no cached tokens, initiate an interactive call
                if (error instanceof msal.InteractionRequiredAuthError) {
                    let state = CryptoUtilities.base64EncodeUrl(
                    JSON.stringify({
                        stage: constants.AppStages.ACQUIRE_TOKEN,
                        path: req.route.path,
                        nonce: this.nonce
                    }), null);

                // initiate the first leg of auth code grant to get token
                this.getAuthCode(
                    this.msalConfig.auth.authority, 
                    scopes, 
                    state, 
                    this.msalConfig.auth.redirectUri, 
                    res);
                }
            });
    };

    /**
     * Middleware that gets token to be used by the 
     * downstream web API on-behalf of the user
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    getTokenOnBehalf = async(req, res, next) => {
        next();
    }

    /**
     * Middleware checks for id token (and redirects to sign-in?)
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    isAuthenticated = (req, res, next) => {  
        if (req.session) {
            if (!req.session.isAuthenticated) {
                return res.status(401).send("Not Permitted");
            }
            next();
        } else {
            return res.status(401).send("Not Permitted");
        }   
    };

    /**
     * Middleware checks for access token (and redirects to get token?)
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    isAuthorized = async(req, res, next) => {
        if (req.headers.authorization) {
            if (!this.validateAccessToken(req.headers.authorization)) {
                return res.status(401).send("Not Permitted");
            }
            next();
        } else {
            res.status(401).send("Not Permitted");
        }
    };

    // ============== UTILS ===============
    
    /**
     * Validates the id token for a set of claims
     * @param {Object} idTokenClaims: decoded id token claims
     */
    validateIdToken = (idTokenClaims) => {
        const now = Math.round((new Date()).getTime() / 1000); // in UNIX format
        
        const checkAudience = idTokenClaims["aud"] === this.msalConfig.auth.clientId ? true : false;
        const checkTimestamp = idTokenClaims["iat"] < now && idTokenClaims["exp"] > now ? true: false;
        const checkTenant = this.rawConfig.hasOwnProperty('policies') || idTokenClaims["tid"] === this.rawConfig.credentials.tenantId ? true : false;
    
        if (checkAudience && checkTimestamp && checkTenant) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Validates the access token for signature 
     * and against a predefined set of claims
     * @param {Object} token: raw access token
     */
    validateAccessToken = async(accessTokenInHeader) => {
        const now = Math.round((new Date()).getTime() / 1000); // in UNIX format

        const authHeader = accessTokenInHeader;
        const accessToken = authHeader.split(' ')[1];
    
        jwt.verify(accessToken, this.getSigningKeys, null, (err, payload) => {
            if (err) {
                console.log(err);
                return false;
            }

            console.log(payload);

            const checkAudience = (payload['ver'] === '1.0' && payload['aud'] === 'api://' + this.rawConfig.credentials.clientId) 
                || (payload['ver'] === '2.0' && payload['aud'] === this.rawConfig.credentials.clientId) ? true : false;

            const checkIssuer = payload['iss'].includes(this.rawConfig.credentials.tenantId) ? true: false;
            const checkTimestamp = payload["iat"] < now && payload["exp"] > now ? true: false;
            // TODO: const checkScope = payload['scp'] === 'access_as_user' ? true: false;

            if (checkAudience && checkIssuer && checkTimestamp) {
                return true;
            } else {
                return false;
            }
        });
    };
    
    /**
     * Fetches signing keys of an access token 
     * from the authority discovery endpoint
     * @param {String} header 
     * @param {Function} callback 
     */
    getSigningKeys = async(header, callback) => {
        let client; 

        if (this.rawConfig.hasOwnProperty('policies')) {
            client = jwksClient({
                jwksUri: `${this.msalConfig.auth.authority}/discovery/v2.0/keys`
            });
        } else {
            client = jwksClient({
                jwksUri: `${constants.AuthorityStrings.AAD}${this.rawConfig.credentials.tenantId}/discovery/v2.0/keys`
            });
        }
    
        client.getSigningKey(header.kid, function (err, key) {
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    };

    /**
     * this fetches the resource with axios
     * @param {String} endpoint: resource endpoint
     * @param {String} accessToken: raw token 
     * @param {Function} callback: call after resource fetched
     */
    callAPI = async(endpoint, accessToken, callback) => {
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
     * Util method to get the resource name for a given callingPageRoute (auth.json)
     * @param {String} path: /path string that the resource is associated with 
     */
    getResourceName = (path) => {
        let index = Object.values(this.rawConfig.resources).findIndex(resource => resource.callingPageRoute === path);
        let resourceName = Object.keys(this.rawConfig.resources)[index];
        return resourceName;
    }

}

module.exports = MsalExpressMiddleware;