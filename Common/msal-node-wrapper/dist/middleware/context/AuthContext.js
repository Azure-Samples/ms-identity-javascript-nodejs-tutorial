/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
'use strict';

var loginHandler = require('../handlers/loginHandler.js');
var logoutHandler = require('../handlers/logoutHandler.js');
var acquireTokenHandler = require('../handlers/acquireTokenHandler.js');
var TimeUtils = require('../../node_modules/@azure/msal-common/dist/utils/TimeUtils.js');

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
            const isTokenExpired = TimeUtils.TimeUtils.isTokenExpired(Math.floor(expiresOn.getTime() / 1000).toString(), 300);
            if (!isTokenExpired) {
                return this.context.req.session.protectedResources[resourceName].accessToken;
            }
        }
        return null;
    }
}

exports.AuthContext = AuthContext;
//# sourceMappingURL=AuthContext.js.map
