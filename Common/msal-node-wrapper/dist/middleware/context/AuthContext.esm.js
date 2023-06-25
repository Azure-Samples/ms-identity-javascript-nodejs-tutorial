/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
import loginHandler from '../handlers/loginHandler.esm.js';
import logoutHandler from '../handlers/logoutHandler.esm.js';
import acquireTokenHandler from '../handlers/acquireTokenHandler.esm.js';
import { TimeUtils } from '../../node_modules/@azure/msal-common/dist/utils/TimeUtils.esm.js';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class AuthContext {
    constructor(provider, context) {
        this.provider = provider;
        this.context = context;
    }
    /**
     * Initiates a login flow with given options
     * @param {LoginOptions} options: options to modify the login request
     * @returns {RequestHandler}
     */
    login(options = {
        postLoginRedirectUri: "/",
        postFailureRedirectUri: "/",
        scopes: [],
    }) {
        return loginHandler.call(this.provider, options);
    }
    /**
     * Initiates a logout flow and destroys the current session
     * @param {LogoutOptions} options: options to modify logout request
     * @returns {RequestHandler}
     */
    logout(options = {
        postLogoutRedirectUri: "/",
        idpLogout: true
    }) {
        return logoutHandler.call(this.provider, options);
    }
    /**
     * Acquires an access token for given request parameters
     * @param {TokenRequestOptions} options: options to modify token request
     * @returns {RequestHandler}
     */
    acquireToken(options = {
        scopes: [],
    }) {
        return acquireTokenHandler.call(this.provider, options);
    }
    /**
     * Returns the current user account from session
     * @returns {AccountInfo} account object
     */
    getAccount() {
        return this.context.req.session.account || undefined; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }
    /**
     * Returns true if session contains user account
     * @returns {boolean} authentication status
     */
    isAuthenticated() {
        return !!this.getAccount();
    }
    /**
     * Returns the cached token for a given resource
     * @param {string} resourceName: name of the resource to retrieve token for
     * @returns {string | null} cached access token
     */
    getCachedTokenForResource(resourceName) {
        if (this.context.req.session.protectedResources && this.context.req.session.protectedResources[resourceName]) {
            const expiresOn = new Date(this.context.req.session.protectedResources[resourceName].expiresOn);
            if (!expiresOn) {
                return null;
            }
            const isTokenExpired = TimeUtils.isTokenExpired(Math.floor(expiresOn.getTime() / 1000).toString(), 300);
            if (!isTokenExpired) {
                return this.context.req.session.protectedResources[resourceName].accessToken;
            }
        }
        return null;
    }
}

export { AuthContext };
//# sourceMappingURL=AuthContext.esm.js.map
