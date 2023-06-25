/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
'use strict';

var msalNode = require('@azure/msal-node');
var InteractionRequiredError = require('../../error/InteractionRequiredError.js');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function acquireTokenHandler(options, useAsMiddlewareOptions) {
    return async (req, _res, next) => {
        this.getLogger().trace("acquireTokenHandler called");
        try {
            const account = options.account || req.session.account;
            if (!account) {
                throw new InteractionRequiredError.InteractionRequiredError("no_account_found", "No account found either in options or in session", undefined, options);
            }
            const silentRequest = {
                account: account,
                scopes: options.scopes,
                claims: options.claims,
                tokenQueryParameters: options.tokenQueryParameters,
            };
            const msalInstance = this.getMsalClient();
            if (req.session.tokenCache) {
                msalInstance.getTokenCache().deserialize(req.session.tokenCache);
            }
            const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);
            req.session.tokenCache = msalInstance.getTokenCache().serialize();
            if (!tokenResponse) {
                throw new InteractionRequiredError.InteractionRequiredError("null_response", "AcquireTokenSilent return null response", undefined, options);
            }
            if (useAsMiddlewareOptions) {
                if (!req.session.protectedResources) {
                    req.session.protectedResources = {
                        [useAsMiddlewareOptions.resourceName]: tokenResponse
                    };
                }
                else {
                    req.session.protectedResources[useAsMiddlewareOptions.resourceName] = tokenResponse;
                }
                return next();
            }
            return tokenResponse;
        }
        catch (error) {
            if (error instanceof msalNode.InteractionRequiredAuthError) {
                return next(new InteractionRequiredError.InteractionRequiredError(error.errorCode, error.errorMessage, error.subError, options));
            }
            next(error);
        }
    };
}

module.exports = acquireTokenHandler;
//# sourceMappingURL=acquireTokenHandler.js.map
