const msal = require('@azure/msal-node');
const { getClaims, hasClaims } = require('../utils/claimUtils');
const { msalConfig, GRAPH_ME_ENDPOINT } = require('../authConfig');

class MsalWebAppWrapper {
    config;
    msalInstance;
    cryptoProvider;

    constructor(config) {
        this.config = config;
        this.cryptoProvider = new msal.CryptoProvider();
        this.msalInstance = new msal.ConfidentialClientApplication(this.config.msalConfig);
    }

    async login(req, res, next) {
        // create a GUID for csrf
        req.session.csrfToken = this.cryptoProvider.createNewGuid();

        /**
         * MSAL Node allows you to pass your custom state as state parameter in the Request object.
         * The state parameter can also be used to encode information of the app's state before redirect.
         * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
         */
        const state = this.cryptoProvider.base64Encode(
            JSON.stringify({
                csrfToken: req.session.csrfToken,
                redirectTo: '/',
            })
        );

        let claims = null;
        if (hasClaims(req)) {
            claims = getClaims(req, msalConfig.auth.clientId, GRAPH_ME_ENDPOINT);
        }

        const authCodeUrlRequestParams = {
            state: state,

            /**
             * By default, MSAL Node will add OIDC scopes to the auth code url request. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
             */
            scopes: ['User.Read'],
            claims: claims,
        };

        const authCodeRequestParams = {
            /**
             * By default, MSAL Node will add OIDC scopes to the auth code request. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
             */
            scopes: ['User.Read'],
            claims: claims,
        };

        const msalInstance = this.getMsalInstance();
        try {
            return await this.redirectToAuthCodeUrl(
                req,
                res,
                next,
                authCodeUrlRequestParams,
                authCodeRequestParams,
                msalInstance
            );
        } catch (error) {
            next(error)
        } 
    }

    async redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams, msalInstance) {
        const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();
        req.session.pkceCodes = {
            challengeMethod: 'S256',
            verifier: verifier,
            challenge: challenge,
        };

        req.session.authCodeUrlRequest = {
            redirectUri: this.config.redirectUri,
            responseMode: msal.ResponseMode.FORM_POST, // recommended for confidential clients
            codeChallenge: req.session.pkceCodes.challenge,
            codeChallengeMethod: req.session.pkceCodes.challengeMethod,
            ...authCodeUrlRequestParams,
        };

        req.session.authCodeRequest = {
            redirectUri: this.config.redirectUri,
            code: '',
            ...authCodeRequestParams,
        };

        try {
            const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
            return authCodeUrlResponse;
        } catch (error) {
            next(error)
        }
    }

    getMsalInstance() {
        return this.msalInstance;
    }

    async handleRedirect(req, res, next) {
        if (!req.body.state) {
            return next(new Error('state is missing'));
        }

        const state = JSON.parse(this.cryptoProvider.base64Decode(req.body.state));
        if (state.csrfToken !== req.session.csrfToken) {
            return next(new Error('csrf token does not match'));
        }

        req.session.authCodeRequest.code = req.body.code; // authZ code
        req.session.authCodeRequest.codeVerifier = req.session.pkceCodes.verifier; // PKCE Code Verifier

        try {
            const msalInstance = this.getMsalInstance();
            const tokenResponse = await msalInstance.acquireTokenByCode(req.session.authCodeRequest);
            req.session.accessToken = tokenResponse.accessToken;
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;
            req.session.isAuthenticated = true;
            return {
                tokenResponse,
                redirectTo: state.redirectTo
            };
        } catch(error) {
            next(error)
        }
    }

    logout(req, res, next) {
        /**
         * Construct a logout URI and redirect the user to end the
         * session with Azure AD. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
         */

        const logoutUri = `${this.config.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${this.config.postLogoutRedirectUri}`;
        
        req.session.destroy(() => {
            res.redirect(logoutUri);
        });
    }

    isAuthenticated(req, res, next) {
        if(req.session && req.session.isAuthenticated){
            return req.session.isAuthenticated;
        } else {
            return  false
        }
    }

    async getAccount(req, res, next) {
        return req.session.account
    }

    async acquireToken(req, res, next) {
        const msalInstance = this.getMsalInstance();
        try {
            const tokenResponse = await msalInstance.acquireTokenSilent({
                account: req.session.account,
                scopes: ['User.Read'],
                claims: hasClaims(req) ? getClaims(req, msalConfig.auth.clientId, GRAPH_ME_ENDPOINT) : null,
            });
            req.session.accessToken = tokenResponse.accessToken;
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;
            return tokenResponse;
        } catch (error) {
            if (error instanceof msal.InteractionRequiredAuthError) {
                next(error)                
            }else {
                next(error)
            }
        }
    }



}


module.exports = MsalWebAppWrapper;
