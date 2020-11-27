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
 * MsalNodeWrapper is a simple wrapper around MSAL Node
 * ConfidentialClientApplication object. It offers a collection of middleware 
 * and utility methods that automate basic authentication and authorization
 * needs in Express MVC web apps and APIs. 
 * 
 * You must have express-sessions package installed. Middleware here 
 * can be used with express sessions in route controllers.
 * 
 * Session variables accessible are as follows:
    * req.session.isAuthenticated => boolean
    * req.session.isAuthorized => boolean
    * req.session.idTokenClaims => object
    * req.session.account => object
    * req.session.resourceName.accessToken => string
    * req.session.resourceName.resourceResponse => object
    * req.session.homeAccountId => string
    * reg.session.rand => string
    * req.session.authCodeRequest => object
    * req.session.tokenRequest => object
 */
class MsalNodeWrapper {

    // configuration object passed in constructor
    rawConfig;

    // MSAL Node configuration object
    msalConfig;

    // MSAL Node ConfidentialClientApplication object
    msalClient;
    
    /**
     * 
     * @param {JSON} config: auth.json 
     * @param {Object} cache: cachePlugin
     */
    constructor(config, cache = null) {
        if (!MsalNodeWrapper.validateConfiguration(config)) {
            throw new Error("invalid configuration");  
        }

        this.rawConfig = config;
        this.msalConfig = MsalNodeWrapper.shapeConfiguration(config, cache);
        this.msalClient = new msal.ConfidentialClientApplication(this.msalConfig);
    };

    /**
     * Validates the fields in the custom JSON configuration file
     * @param {JSON} config: auth.json
     */
    static validateConfiguration = (config) => {

        // TODO: expand validation logic
        
        return config.credentials !== undefined &&
        config.credentials.clientId !== undefined && 
        config.credentials.tenantId !== undefined;
    };

    /**
     * Maps the custom JSON configuration file to configuration
     * object expected by MSAL Node ConfidentialClientApplication
     * @param {JSON} config
     * @param {Object} cachePlugin: passed at initialization
     */
    static shapeConfiguration = (config, cachePlugin) => {
        return {
            auth: {
                clientId: config.credentials.clientId,
                authority: config.hasOwnProperty('policies') ? config.policies.signUpSignIn.authority : constants.AuthorityStrings.AAD + config.credentials.tenantId, // single organization
                clientSecret: config.credentials.clientSecret,
                redirectUri: config.hasOwnProperty('configuration') ? config.configuration.redirectUri : null, // defaults to calling page
                knownAuthorities: config.hasOwnProperty('policies') ? [config.policies.authorityDomain] : [], // 
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
    };

    // ========= MIDDLEWARE ===========

    /**
     * Initiate sign in flow
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    signIn = (req, res, next) => {

        /** 
         * Request Configuration
         * We manipulate these three request objects below 
         * to acquire a token with the appropriate claims
         */        

        if (!req.session['authCodeRequest']) {
            req.session.authCodeRequest = {
                authority: "",
                scopes: [],
                state: {},
                redirectUri: ""
            };
        }

        if (!req.session['tokenRequest']) {
            req.session.tokenRequest = {
                authority: "",
                scopes: [],
                state: {},
                redirectUri: ""
            };
        }

        // current account id
        req.session.homeAccountId = "";

        // random GUID for csrf check 
        req.session.rand = CryptoUtilities.generateGuid();

        // state in context
        const state = Object.keys(req.session.authCodeRequest.state).length !== 0 ? 
            JSON.parse(CryptoUtilities.base64DecodeUrl(req.session.authCodeRequest.state)) : null;
        /**
         * We check here what this sign-in is for. In B2C scenarios, a sign-in 
         * can be for initiating the password reset user-flow. 
         */
        if (state && state.stage === constants.AppStages.RESET_PASSWORD) {
            let state = CryptoUtilities.base64EncodeUrl(
                JSON.stringify({
                    stage: constants.AppStages.RESET_PASSWORD,
                    path: req.route.path,
                    rand: req.session.rand
                }), null);
    
            // if coming for password reset, set the authority to resetPassword
            this.getAuthCode(
                this.rawConfig.policies.resetPassword.authority, 
                Object.values(constants.OIDCScopes), 
                state, 
                this.msalConfig.auth.redirectUri,
                req,
                res
                );

        } else {
            // sign-in as usual
            let state = CryptoUtilities.base64EncodeUrl(
                JSON.stringify({
                    stage: constants.AppStages.SIGN_IN,
                    path: req.route.path,
                    rand: req.session.rand
                }), null);

            // get url to sign user in (and consent to scopes needed for application)
            this.getAuthCode(
                this.msalConfig.auth.authority, 
                Object.values(constants.OIDCScopes), 
                state, 
                this.msalConfig.auth.redirectUri,
                req, 
                res
            );
        }
    };

    /**
     * Initiate sign out and clean the session
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    signOut = (req, res) => {

        /**
         * Construct a logout URI and redirect the user to end the 
         * session with Azure AD/B2C. For more information, visit: 
         * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
         * (B2C) https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
         */
        const logoutURI = `${this.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${this.rawConfig.configuration.postLogoutRedirectUri}`;

        req.session.isAuthenticated = false;
        
        req.session.destroy(() => {
            res.redirect(logoutURI);
        });
    };
    
    /**
     * Middleware that handles redirect depending on request state
     * There are basically 3 states: sign-in, acquire token
     * and password reset user-flows for B2C scenarios
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    handleRedirect = async(req, res, next) => {
        const state = JSON.parse(CryptoUtilities.base64DecodeUrl(req.query.state));

        // check if rand matches
        if (state.rand === req.session.rand) {
            if (state.stage === constants.AppStages.SIGN_IN) {

                // token request should have auth code
                const tokenRequest = {
                    redirectUri: this.msalConfig.auth.redirectUri,
                    scopes: Object.keys(constants.OIDCScopes),
                    code: req.query.code,
                };

                // exchange auth code for tokens
                this.msalClient.acquireTokenByCode(tokenRequest)
                    .then((response) => {
                        console.log("\nResponse: \n:", response);

                        if (this.validateIdToken(response.idTokenClaims)) {
                            
                            req.session.homeAccountId = response.account.homeAccountId;

                            // assign session variables
                            req.session.idTokenClaims = response.idTokenClaims;
                            req.session.isAuthenticated = true;

                            return res.status(200).redirect(this.rawConfig.configuration.homePageRoute);
                        } else {
                            console.log('invalid token');
                            return res.status(401).send("Not Permitted");
                        }
                    }).catch((error) => {
                        console.log(error);

                        if (req.query.error) {
 
                            /**
                             * When the user selects "forgot my password" on the sign-in page, B2C service will throw an error.
                             * We are to catch this error and redirect the user to login again with the resetPassword authority.
                             * For more information, visit: https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview#linking-user-flows
                             */
                            if (JSON.stringify(req.query.error_description).includes("AADB2C90118")) {

                                req.session.rand = CryptoUtilities.generateGuid();

                                let newState = CryptoUtilities.base64EncodeUrl(
                                    JSON.stringify({
                                        stage: constants.AppStages.RESET_PASSWORD,
                                        path: req.route.path,
                                        rand: req.session.rand
                                    }), null);

                                req.session.authCodeRequest.state = newState;
                                req.session.authCodeRequest.authority = this.rawConfig.policies.resetPassword.authority;

                                // redirect to sign in page again with resetPassword authority
                                return res.redirect(state.path);
                            }
                        }
                        res.status(500).send(error);
                    });

            } else if (state.stage === constants.AppStages.ACQUIRE_TOKEN) {

                // get the name of the resource associated with scope
                let resourceName = this.getResourceName(state.path);

                const tokenRequest = {
                    code: req.query.code,
                    scopes: this.rawConfig.resources[resourceName].scopes, // scopes for resourceName
                    redirectUri: this.rawConfig.configuration.redirectUri,
                };
                

                this.msalClient.acquireTokenByCode(tokenRequest)
                    .then((response) => {
                        console.log("\nResponse: \n:", response);

                        req.session[resourceName].accessToken = response.accessToken;

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
                req.session.rand = CryptoUtilities.generateGuid();
                
                let newState = CryptoUtilities.base64EncodeUrl(
                    JSON.stringify({
                        stage: constants.AppStages.SIGN_IN,
                        path: req.route.path,
                        rand: req.session.rand
                    }), null);

                req.session.authCodeRequest.state = newState;

                res.redirect(state.path);
            } else {
                res.status(500).send("Unknown app stage");
            }
        } else {
                res.status(401).send("Not Permitted");
        }
    };

    /**
     * Middleware that gets token and call web APIs
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    getToken = async(req, res, next) => {

        // get scopes for token request
        let scopes = Object.values(this.rawConfig.resources)
            .find(resource => resource.callingPageRoute === req.route.path).scopes;

        let resourceName = this.getResourceName(req.route.path);
        
        if (!req.session[resourceName]) {
            req.session[resourceName] = {
                accessToken: null,
                resourceResponse: null,
            };
        }

        // find account using homeAccountId built after receiving token response
        let account = await this.msalClient.getTokenCache().getAccountByHomeId(req.session.homeAccountId);

        // TODO: cache fail safe
        if (!account) {
            throw new Error('account not found');
        }

        const silentRequest = {
            account: account,
            scopes: scopes,
        };


        // acquire token silently to be used in resource call
        this.msalClient.acquireTokenSilent(silentRequest)
            .then((response) => {
                console.log("\nSuccessful silent token acquisition:\nResponse: \n:", response);

                // TODO: In B2C scenarios, sometimes an access token is returned empty
                // due to improper refresh tokens in cache. In that case, we will acquire token
                // interactively instead.
                if (response.accessToken.length === 0) {
                    console.log('no access token found, falling back to interactive acquisition');

                    let state = CryptoUtilities.base64EncodeUrl(
                        JSON.stringify({
                            stage: constants.AppStages.ACQUIRE_TOKEN,
                            path: req.route.path,
                            rand: req.session.rand
                        }), null);
    
                    // initiate the first leg of auth code grant to get token
                    this.getAuthCode(
                        this.msalConfig.auth.authority, 
                        scopes, 
                        state, 
                        this.msalConfig.auth.redirectUri,
                        req, 
                        res
                        );
                }

                req.session[resourceName].accessToken = response.accessToken;

                // call the web API
                this.callAPI(this.rawConfig.resources[resourceName].endpoint, response.accessToken, (resourceResponse) => {
                    console.log('resource responded: ', resourceResponse);
                    req.session[resourceName].resourceResponse = resourceResponse;
                    return next();
                });
            })
            .catch((error) => {

                // in case there are no cached tokens, initiate an interactive call
                if (error instanceof msal.InteractionRequiredAuthError) {
                    let state = CryptoUtilities.base64EncodeUrl(
                    JSON.stringify({
                        stage: constants.AppStages.ACQUIRE_TOKEN,
                        path: req.route.path,
                        rand: req.session.rand
                    }), null);

                    // initiate the first leg of auth code grant to get token
                    this.getAuthCode(
                        this.msalConfig.auth.authority, 
                        scopes, 
                        state, 
                        this.msalConfig.auth.redirectUri,
                        req, 
                        res
                        );
                }
            });
    };

    /**
     * Middleware that gets token to be used by the 
     * downstream web API on-behalf of user in context
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    getTokenOnBehalf = async(req, res, next) => {
        const authHeader = req.headers.authorization;

        const oboRequest = {
            oboAssertion: authHeader.split(' ')[1],
            scopes: ["user.read"],
        }

        // get the resource name for attaching resource response to req
        const resourceName = this.getResourceName(req.route.path);
    
        this.msalClient.acquireTokenOnBehalfOf(oboRequest)
            .then((response) => {
                console.log("\nResponse: \n:", response);

                this.callAPI(this.rawConfig.resources[resourceName].endpoint, response.accessToken, (resourceResponse) => {
                    req[resourceName].resourceResponse = resourceResponse;
                    return next();
                });

            }).catch((error) => {
                res.status(500).send(error);
            });
    }

    /**
     * Check if authenticated in session
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
     * Receives access token in req authorization header
     * and validates it using the jwt.verify
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    isAuthorized = async(req, res, next) => {
        if (req.headers.authorization) {
            if (!(await this.validateAccessToken(req))) {
                return res.status(401).send("Not Permitted");
            } else {
                next();
            }
        } else {
            res.status(401).send("Not Permitted");
        }
    };

    /**
     * Initiates the edit profile user-flow in
     * B2C scenarios. The user should already be signed-in.
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    editProfile = (req, res, next) => {
        
        req.session.rand = CryptoUtilities.generateGuid();

        let state = CryptoUtilities.base64EncodeUrl(
            JSON.stringify({
                stage: constants.AppStages.SIGN_IN,
                path: req.route.path,
                rand: req.session.rand
            }), null);

        this.getAuthCode(
            this.rawConfig.policies.editProfile.authority, 
            Object.values(constants.OIDCScopes), 
            state, 
            this.msalConfig.auth.redirectUri, 
            req, 
            res
        );
    }

    // ============== UTILS ===============
    
    /**
     * Validates the id token for a set of claims
     * @param {Object} idTokenClaims: decoded id token claims
     */
    validateIdToken = (idTokenClaims) => {
        const now = Math.round((new Date()).getTime() / 1000); // in UNIX format
        
        /**
         * At the very least, check for tenant, audience, issue and expiry dates. 
         * For more information on validating id tokens, visit: 
         * https://docs.microsoft.com/azure/active-directory/develop/id-tokens#validating-an-id_token
         */
        const checkAudience = idTokenClaims["aud"] === this.msalConfig.auth.clientId ? true : false;
        const checkTimestamp = idTokenClaims["iat"] <= now && idTokenClaims["exp"] >= now ? true: false;

        // TODO: B2C check tenant
        const checkTenant = (this.rawConfig.hasOwnProperty('policies') && idTokenClaims["tid"] === undefined) || idTokenClaims["tid"] === this.rawConfig.credentials.tenantId ? true : false;

        return checkAudience && checkTimestamp;
    };

    /**
     * Validates the access token for signature 
     * and against a predefined set of claims
     * @param {Object} req: Express req object with authorization header
     */
    validateAccessToken = async(req) => {
        const now = Math.round((new Date()).getTime() / 1000); // in UNIX format

        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(' ')[1];
        
        if (!accessToken) {
            return false;
        }

        // we will first decode to get kid in header
        const decodedToken = jwt.decode(accessToken, {complete: true});

        // obtains signing keys from discovery endpoint
        const keys = await this.getSigningKeys(decodedToken.header);

        try {
            // verify the signature at header section using keys
            const verifiedToken = jwt.verify(accessToken, keys);

            /**
             * Validate the token with respect to issuer, audience, scope
             * and timestamp, though implementation and extent vary. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validating-tokens
             */
            const checkIssuer = verifiedToken['iss'].includes(this.rawConfig.credentials.tenantId) ? true : false;
            const checkTimestamp = verifiedToken["iat"] <= now && verifiedToken["exp"] >= now ? true : false;
            const checkAudience = verifiedToken['aud'] === this.rawConfig.credentials.clientId || verifiedToken['aud'] === 'api://' + this.rawConfig.credentials.clientId ? true : false;
            const checkScope = this.rawConfig.protected.find(item => item.route === req.route.path).scopes
                .every(scp => verifiedToken['scp'].includes(scp));

            if (checkAudience && checkIssuer && checkTimestamp && checkScope) {

                // token claims will be available in the request for the controller
                req.authInfo = verifiedToken;
                return true;
            }
            return false;
        } catch(err) {
            console.log(err);
            return false;
        }
    };
    
    /**
     * Fetches signing keys of an access token 
     * from the authority discovery endpoint
     * @param {String} header 
     * @param {Function} callback 
     */
    getSigningKeys = async(header) => {
        let client; 

        // TODO: Check if a B2C application
        if (this.rawConfig.hasOwnProperty('policies')) {
            client = jwksClient({
                jwksUri: `${this.msalConfig.auth.authority}/discovery/v2.0/keys`
            });
        } else {
            client = jwksClient({
                jwksUri: `${constants.AuthorityStrings.AAD}${this.rawConfig.credentials.tenantId}/discovery/v2.0/keys`
            });
        }

        return (await client.getSigningKeyAsync(header.kid)).getPublicKey();
    };

    /**
     * This fetches the resource with axios
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
    
        // TODO: remove callback and use promises
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
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     */
    getAuthCode = (authority, scopes, state, redirect, req, res) => {
        // prepare the request
        req.session.authCodeRequest.authority = authority;
        req.session.authCodeRequest.scopes = scopes;
        req.session.authCodeRequest.state = state;
        req.session.authCodeRequest.redirectUri = redirect;
        req.session.tokenRequest.authority = authority;

        // request an authorization code to exchange for tokens
        return this.msalClient.getAuthCodeUrl(req.session.authCodeRequest)
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

module.exports = MsalNodeWrapper;