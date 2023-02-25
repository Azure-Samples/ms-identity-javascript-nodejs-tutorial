const msal = require('@azure/msal-node');
const axios = require('axios');

const { getClaims } = require('../utils/claimUtils');
const { 
    GRAPH_ME_ENDPOINT, 
    SESSION_COOKIE_NAME, 
    STATE_COOKIE_NAME 
} = require('../authConfig');

class AuthProvider {
    config;
    cryptoProvider;

    constructor(config) {
        this.config = config;
        this.cryptoProvider = new msal.CryptoProvider();
    }

    getMsalInstance() {
        return new msal.ConfidentialClientApplication(this.config.msalConfig);
    }

    async login(req, res, next, options = {}) {
        /**
         * MSAL Node allows you to pass your custom state as state parameter in the Request object.
         * The state parameter can also be used to encode information of the app's state before redirect.
         * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
         */
        const state = this.cryptoProvider.base64Encode(
            JSON.stringify({
                csrfToken: this.cryptoProvider.createNewGuid(), // create a GUID for csrf
                redirectTo: options.postLoginRedirectUri ? options.postLoginRedirectUri : '/',
            })
        );

        const authCodeUrlRequestParams = {
            state: state,
            /**
             * By default, MSAL Node will add OIDC scopes to the auth code url request. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
             */
            scopes: options.scopesToConsent ? options.scopesToConsent.split(' ') : [],
            claims: getClaims(req.session, this.config.msalConfig.auth.clientId, GRAPH_ME_ENDPOINT),
        };

        const authCodeRequestParams = {
            state: state,
            /**
             * By default, MSAL Node will add OIDC scopes to the auth code request. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
             */
            scopes: options.scopesToConsent ? options.scopesToConsent.split(' ') : [],
            claims: getClaims(req.session, this.config.msalConfig.auth.clientId, GRAPH_ME_ENDPOINT),
        };

        /**
         * 
         */
        if (!this.config.msalConfig.auth.cloudDiscoveryMetadata || !this.config.msalConfig.auth.authorityMetadata) {

            const [cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
                this.getCloudDiscoveryMetadata(),
                this.getAuthorityMetadata()
            ]);

            this.config.msalConfig.auth.cloudDiscoveryMetadata = JSON.stringify(cloudDiscoveryMetadata);
            this.config.msalConfig.auth.authorityMetadata = JSON.stringify(authorityMetadata);
        }

        const msalInstance = this.getMsalInstance();

        return this.redirectToAuthCodeUrl(
            req,
            res,
            next,
            authCodeUrlRequestParams,
            authCodeRequestParams,
            msalInstance
        );
    }

    async redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams, msalInstance) {
        const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();

        const authCodeUrlRequest = {
            redirectUri: this.config.redirectUri,
            responseMode: msal.ResponseMode.FORM_POST, // recommended for confidential clients
            codeChallenge: challenge,
            codeChallengeMethod: 'S256',
            ...authCodeUrlRequestParams,
        };

        const cookiePayload = {
            pkceCodes: {
                verifier: verifier,
            },
            authCodeRequest: {
                redirectUri: this.config.redirectUri,
                ...authCodeRequestParams,
            }
        };

        try {
            const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(authCodeUrlRequest);

            res.cookie(STATE_COOKIE_NAME, cookiePayload, { httpOnly: true, secure: true, sameSite: 'none' });
            res.redirect(authCodeUrlResponse);
        } catch (error) {
            next(error)
        }
    }

    async handleRedirect(req, res, next) {
        const authCodeRequest = {
            ...req.cookies[STATE_COOKIE_NAME].authCodeRequest,
            code: req.body.code,
            codeVerifier: req.cookies[STATE_COOKIE_NAME].pkceCodes.verifier,
        }

        try {
            const msalInstance = this.getMsalInstance();
            const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);

            req.session.tokenCache = msalInstance.getTokenCache().serialize();
            req.session.accessToken = tokenResponse.accessToken;
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;
            req.session.isAuthenticated = true;

            const { redirectTo } = JSON.parse(this.cryptoProvider.base64Decode(req.body.state));

            res.clearCookie(STATE_COOKIE_NAME, { httpOnly: true, secure: true, sameSite: 'none'});
            res.redirect(redirectTo);
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        /**
         * Construct a logout URI and redirect the user to end the
         * session with Azure AD. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
         */
        const logoutUri = `${this.config.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${this.config.postLogoutRedirectUri}`;

        req.session.destroy(() => {
            res.clearCookie(SESSION_COOKIE_NAME);
            res.redirect(logoutUri);
        });
    }

    async acquireToken(req, res, next, options = {}) {
        const msalInstance = this.getMsalInstance();

        try {
            msalInstance.getTokenCache().deserialize(req.session.tokenCache);

            const tokenResponse = await msalInstance.acquireTokenSilent({
                account: req.session.account,
                scopes: options.scopes || [],
                claims: getClaims(req.session, this.config.msalConfig.auth.clientId, GRAPH_ME_ENDPOINT),
            });

            req.session.tokenCache = msalInstance.getTokenCache().serialize();
            req.session.accessToken = tokenResponse.accessToken;
            req.session.idToken = tokenResponse.idToken;
            req.session.account = tokenResponse.account;

            return tokenResponse;
        } catch (error) {
            if (error instanceof msal.InteractionRequiredAuthError) {
                const err = new Error('InteractionRequiredAuthError occurred for given scopes');
                err.payload = options.scopes.join(' ');
                err.name = 'InteractionRequiredAuthError';
                throw err;
            } else {
                throw error;
            }
        }
    }

    isAuthenticated(req, res, next) {
        if (req.session && req.session.isAuthenticated) {
            return true;
        }

        return false;
    }

    getAccount(req, res, next) {
        if (this.isAuthenticated(req, res, next)) {
            return req.session.account
        }

        return null;
    }

    /**
     * Retrieves cloud discovery metadata from the /discovery/instance endpoint
     * @returns 
     */
    async getCloudDiscoveryMetadata() {
        const endpoint = 'https://login.microsoftonline.com/common/discovery/instance';

        try {
            const response = await axios.get(endpoint, {
                params: {
                    'api-version': '1.1',
                    'authorization_endpoint': `${this.config.msalConfig.auth.authority}/oauth2/v2.0/authorize`
                }
            });

            return await response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves oidc metadata from the openid endpoint
     * @returns 
     */
    async getAuthorityMetadata() {
        const endpoint = `${this.config.msalConfig.auth.authority}/v2.0/.well-known/openid-configuration`;

        try {
            const response = await axios.get(endpoint);
            return await response.data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthProvider;
