/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    InteractionRequiredAuthError,
    OIDC_DEFAULT_SCOPES,
    PromptValue,
} from '@azure/msal-common';

import {
    ConfidentialClientApplication,
    Configuration,
    AccountInfo,
    ICachePlugin,
    CryptoProvider,
    AuthorizationUrlRequest,
    AuthorizationCodeRequest,
} from '@azure/msal-node';

import { ConfigurationUtils } from './ConfigurationUtils';
import { TokenValidator } from './TokenValidator';

import {
    AppSettings,
    Resource,
} from './Types';

import { 
    AppStages,
    ErrorMessages
} from './Constants';

/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate 
 * basic authentication and authorization tasks in Express MVC web apps. 
 * 
 * You must have express and express-sessions package installed. Middleware 
 * here can be used with express sessions in route controllers.
 * 
 * Session variables accessible are as follows:
    * req.session.isAuthenticated => boolean
    * req.session.isAuthorized => boolean
    * req.session.idTokenClaims => object
    * req.session.account => object
    * req.session.resourceName.accessToken => string
 */
export class AuthProvider {

    appSettings: AppSettings;
    msalConfig: Configuration;
    cryptoProvider: CryptoProvider;
    tokenValidator: TokenValidator;
    msalClient: ConfidentialClientApplication;

    /**
     * @param {JSON} appSettings 
     * @param {Object} cache: cachePlugin
     */
    constructor(appSettings: AppSettings, cache?: ICachePlugin) {
        ConfigurationUtils.validateAppSettings(appSettings);

        this.cryptoProvider = new CryptoProvider();

        this.appSettings = appSettings;
        this.msalConfig = ConfigurationUtils.getMsalConfiguration(appSettings, cache);
        this.tokenValidator = new TokenValidator(this.appSettings, this.msalConfig);
        this.msalClient = new ConfidentialClientApplication(this.msalConfig);
    }

    // ========== MIDDLEWARE ===========

    /**
     * Initiate sign in flow
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     */
    signIn = async (req, res): Promise<any> => {

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
                redirectUri: "",
            } as AuthorizationUrlRequest;
        }

        if (!req.session['tokenRequest']) {
            req.session.tokenRequest = {
                authority: "",
                scopes: [],
                redirectUri: ""
            } as AuthorizationCodeRequest;
        }

        if (!req.session['account']) {
            req.session.account = {
                homeAccountId: "",
                environment: "",
                tenantId: "",
                username: "",
                localAccountId: "",
                idTokenClaims: {},
            } as AccountInfo;
        }

        // random GUID for csrf check 
        req.session.nonce = this.cryptoProvider.createNewGuid();

        // sign-in as usual
        const state = this.cryptoProvider.base64Encode(
            JSON.stringify({
                stage: AppStages.SIGN_IN,
                path: req.route.path,
                nonce: req.session.nonce
            })
        );

        // get url to sign user in (and consent to scopes needed for application)
        this.getAuthCode(
            req,
            res,
            this.msalConfig.auth.authority,
            OIDC_DEFAULT_SCOPES,
            state,
            this.appSettings.settings.redirectUri,
            PromptValue.SELECT_ACCOUNT,
        );
    };

    /**
     * Initiate sign out and clean the session
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    signOut = async (req, res): Promise<any> => {

        /**
         * Construct a logout URI and redirect the user to end the 
         * session with Azure AD/B2C. For more information, visit: 
         * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
         * (B2C) https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
         */
        const logoutURI = `${this.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${this.appSettings.settings.postLogoutRedirectUri}`;

        req.session.isAuthenticated = false;

        req.session.destroy(() => {
            res.redirect(logoutURI);
        });
    }

    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     */
    handleRedirect = async (req, res): Promise<any> => {
        if (!req.query.state) {
            throw new Error("No state!");   
        }

        const state = JSON.parse(this.cryptoProvider.base64Decode(req.query.state));

        // check if nonce matches
        if (state.nonce === req.session.nonce) {

            switch (state.stage) {

                case AppStages.SIGN_IN: {
                    // token request should have auth code
                    const tokenRequest = {
                        redirectUri: this.appSettings.settings.redirectUri,
                        scopes: OIDC_DEFAULT_SCOPES,
                        code: req.query.code,
                    };

                    try {
                        // exchange auth code for tokens
                        const tokenResponse = await this.msalClient.acquireTokenByCode(tokenRequest)
                        console.log("\nResponse: \n:", tokenResponse);

                        if (this.tokenValidator.validateIdToken(tokenResponse.idTokenClaims)) {

                            // assign session variables
                            req.session.account = tokenResponse.account;
                            req.session.isAuthenticated = true;

                            return res.status(200).redirect(this.appSettings.settings.homePageRoute);
                        } else {
                            console.log(ErrorMessages.INVALID_TOKEN);
                            return res.status(401).send(ErrorMessages.NOT_PERMITTED);
                        }
                    } catch (error) {
                        console.log(error);
                        res.status(500).send(error);
                    }
                    break;
                }

                case AppStages.ACQUIRE_TOKEN: {
                    // get the name of the resource associated with scope
                    const resourceName = this.getResourceName(state.path);

                    const tokenRequest = {
                        code: req.query.code,
                        scopes: this.appSettings.resources[resourceName].scopes, // scopes for resourceName
                        redirectUri: this.appSettings.settings.redirectUri,
                    };

                    try {
                        const tokenResponse = await this.msalClient.acquireTokenByCode(tokenRequest);
                        console.log("\nResponse: \n:", tokenResponse);

                        req.session[resourceName].accessToken = tokenResponse.accessToken;
                        return res.status(200).redirect(state.path);

                    } catch (error) {
                        console.log(error);
                        res.status(500).send(error);
                    }
                    break;
                }

                default:
                    res.status(500).send(ErrorMessages.CANNOT_DETERMINE_APP_STAGE);
                    break;
            }
        } else {
            console.log(ErrorMessages.NONCE_MISMATCH)
            res.status(401).send(ErrorMessages.NOT_PERMITTED);
        }
    };

    /**
     * Middleware that gets tokens and calls web APIs
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    getToken = async (req, res, next): Promise<any> => {

        // get scopes for token request
        const scopes = (<Resource>Object.values(this.appSettings.resources)
            .find((resource: Resource) => resource.callingPageRoute === req.route.path)).scopes;

        const resourceName = this.getResourceName(req.route.path);

        if (!req.session[resourceName]) {
            req.session[resourceName] = {
                accessToken: null,
                resourceResponse: null,
            };
        }

        try {
            const silentRequest = {
                account: req.session.account,
                scopes: scopes,
            };

            // acquire token silently to be used in resource call
            const tokenResponse = await this.msalClient.acquireTokenSilent(silentRequest)
            console.log("\nSuccessful silent token acquisition:\n Response: \n:", tokenResponse);

            // In B2C scenarios, sometimes an access token is returned empty.
            // In that case, we will acquire token interactively instead.
            if (tokenResponse.accessToken.length === 0) {
                console.log(ErrorMessages.TOKEN_NOT_FOUND);
                throw new InteractionRequiredAuthError(ErrorMessages.INTERACTION_REQUIRED);
            }

            req.session[resourceName].accessToken = tokenResponse.accessToken;
            return next();

        } catch (error) {
            // in case there are no cached tokens, initiate an interactive call
            if (error instanceof InteractionRequiredAuthError) {

                const state = this.cryptoProvider.base64Encode(
                    JSON.stringify({
                        stage: AppStages.ACQUIRE_TOKEN,
                        path: req.route.path,
                        nonce: req.session.nonce
                    })
                );

                // initiate the first leg of auth code grant to get token
                this.getAuthCode(
                    req,
                    res,
                    this.msalConfig.auth.authority,
                    scopes,
                    state,
                    this.appSettings.settings.redirectUri,
                    undefined,
                    req.session.account
                );
            }
        }
    }

    // ============== GUARD ===============

    /**
     * Check if authenticated in session
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    isAuthenticated = (req, res, next): Promise<any> => {
        if (req.session) {
            if (!req.session.isAuthenticated) {
                return res.status(401).send(ErrorMessages.NOT_PERMITTED);
            }
            next();
        } else {
            return res.status(401).send(ErrorMessages.NOT_PERMITTED);
        }
    }

    /**
     * Receives access token in req authorization header
     * and validates it using the jwt.verify
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {Function} next: express next 
     */
    isAuthorized = async (req, res, next): Promise<any> => {

        const accessToken = req.headers.authorization.split(' ')[1];

        if (req.headers.authorization) {
            if (!(await this.tokenValidator.validateAccessToken(accessToken, req.route.path))) {
                return res.status(401).send(ErrorMessages.NOT_PERMITTED);
            }

            next();
        } else {
            res.status(401).send(ErrorMessages.NOT_PERMITTED);
        }
    }

    // ============== UTILS ===============

    /**
     * This method is used to generate an auth code request
     * @param {Object} req: express request object
     * @param {Object} res: express response object
     * @param {string} authority: the authority to request the auth code from 
     * @param {Array} scopes: scopes to request the auth code for 
     * @param {string} state: state of the application
     * @param {string} redirect: redirect URI where response will be sent
     * @param {string} prompt: prompt type when requesting auth code (optional)
     * @param {AccountInfo} account: account object to be passed (optional)
     */
    private getAuthCode = async (req, res, authority: string, scopes: string[], state: string, redirect: string, prompt?: string, account?: AccountInfo): Promise<any> => {

        // prepare the request
        req.session.authCodeRequest.authority = authority;
        req.session.authCodeRequest.scopes = scopes;
        req.session.authCodeRequest.state = state;
        req.session.authCodeRequest.redirectUri = redirect;
        req.session.authCodeRequest.prompt = prompt;
        req.session.authCodeRequest.account = account;

        req.session.tokenRequest.authority = authority;

        // request an authorization code to exchange for tokens
        try {
            const response = await this.msalClient.getAuthCodeUrl(req.session.authCodeRequest);
            return res.redirect(response);
        } catch (error) {
            console.log(JSON.stringify(error));
            return res.status(500).send(error);
        }
    }

    /**
     * Util method to get the resource name for a given callingPageRoute (appSettings.json)
     * @param {string} path: /path string that the resource is associated with 
     */
    private getResourceName = (path: string): string => {
        const index = Object.values(this.appSettings.resources).findIndex((resource: Resource) => resource.callingPageRoute === path);
        const resourceName = Object.keys(this.appSettings.resources)[index];
        return resourceName;
    }
}






