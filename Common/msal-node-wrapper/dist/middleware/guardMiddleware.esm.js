/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
import { AccessDeniedError } from '../error/AccessDeniedError.esm.js';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function guardMiddleware(options) {
    return (req, res, next) => {
        if (!req.authContext.isAuthenticated()) {
            if (options.forceLogin) {
                return req.authContext.login({
                    postLoginRedirectUri: req.originalUrl,
                    scopes: [],
                })(req, res, next);
            }
            return next(AccessDeniedError.createUnauthorizedAccessError(req.originalUrl, req.authContext.getAccount()));
        }
        if (options.idTokenClaims) {
            const tokenClaims = req.authContext.getAccount()?.idTokenClaims || {};
            const requiredClaims = options.idTokenClaims;
            const hasClaims = Object.keys(requiredClaims).every((claim) => {
                if (requiredClaims[claim] && tokenClaims[claim]) {
                    switch (typeof requiredClaims[claim]) {
                        case "string" :
                            return requiredClaims[claim] === tokenClaims[claim];
                        case "object":
                            if (Array.isArray(requiredClaims[claim])) {
                                const requiredClaimsArray = requiredClaims[claim];
                                const tokenClaimsArray = tokenClaims[claim];
                                return requiredClaimsArray.some((requiredClaim) => tokenClaimsArray.indexOf(requiredClaim) >= 0);
                            }
                            break;
                    }
                }
                return false;
            });
            if (!hasClaims) {
                return next(AccessDeniedError.createForbiddenAccessError(req.originalUrl, req.authContext.getAccount()));
            }
        }
        next();
    };
}

export { guardMiddleware as default };
//# sourceMappingURL=guardMiddleware.esm.js.map
