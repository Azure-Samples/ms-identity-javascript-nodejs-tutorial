/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
'use strict';

var UrlUtils = require('../../utils/UrlUtils.js');
var Constants$1 = require('../../utils/Constants.js');
var Constants = require('../../node_modules/@azure/msal-common/dist/utils/Constants.js');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function loginHandler(options) {
    return async (req, res, next) => {
        this.getLogger().trace("loginHandler called");
        const state = {
            redirectTo: options.postLoginRedirectUri || "/",
            customState: options.state
        };
        const authUrlParams = {
            state: this.getCryptoProvider().base64Encode(JSON.stringify(state)),
            redirectUri: UrlUtils.UrlUtils.ensureAbsoluteUrl(this.webAppAuthConfig.auth.redirectUri, req.protocol, req.get("host") || req.hostname),
            responseMode: Constants.ResponseMode.FORM_POST,
            scopes: options.scopes || [],
            prompt: options.prompt || undefined,
            claims: options.claims || undefined,
            account: options.account || undefined,
            sid: options.sid || undefined,
            loginHint: options.loginHint || undefined,
            domainHint: options.domainHint || undefined,
            extraQueryParameters: options.extraQueryParameters || undefined,
            extraScopesToConsent: options.extraScopesToConsent || undefined,
        };
        req.session.tokenRequestParams = {
            scopes: authUrlParams.scopes,
            state: authUrlParams.state,
            redirectUri: authUrlParams.redirectUri,
            claims: authUrlParams.claims,
            tokenBodyParameters: options.tokenBodyParameters,
            tokenQueryParameters: options.tokenQueryParameters,
            code: Constants$1.EMPTY_STRING,
        };
        try {
            const response = await this.getMsalClient().getAuthCodeUrl(authUrlParams);
            res.redirect(response);
        }
        catch (error) {
            next(error);
        }
    };
}

module.exports = loginHandler;
//# sourceMappingURL=loginHandler.js.map
