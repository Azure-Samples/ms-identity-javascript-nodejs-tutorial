/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
'use strict';

var express = require('express');
var UrlUtils = require('../utils/UrlUtils.js');
var Constants = require('../utils/Constants.js');
var AuthContext = require('./context/AuthContext.js');
var redirectHandler = require('./handlers/redirectHandler.js');
var acquireTokenHandler = require('./handlers/acquireTokenHandler.js');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function authenticateMiddleware(options) {
    const appRouter = express.Router();
    // ensure session is available
    appRouter.use((req, res, next) => {
        if (!req.session) {
            throw new Error(Constants.ErrorMessages.SESSION_NOT_FOUND);
        }
        if (!req.authContext) {
            req.authContext = new AuthContext.AuthContext(this, { req, res, next });
        }
        next();
    });
    appRouter.post(UrlUtils.UrlUtils.getPathFromUrl(this.webAppAuthConfig.auth.redirectUri), redirectHandler.call(this));
    if (this.webAppAuthConfig.auth.frontChannelLogoutUri) {
        /**
         * Expose front-channel logout route. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#single-sign-out
         */
        appRouter.get(UrlUtils.UrlUtils.getPathFromUrl(this.webAppAuthConfig.auth.frontChannelLogoutUri), (req, res, next) => {
            if (req.authContext.isAuthenticated()) {
                return req.authContext.logout({
                    postLogoutRedirectUri: "/",
                    idpLogout: false
                })(req, res, next);
            }
            return res.status(401).send("Unauthorized");
        });
    }
    if (options.protectAllRoutes) {
        appRouter.use((req, res, next) => {
            if (!req.authContext.isAuthenticated()) {
                return req.authContext.login({
                    postLoginRedirectUri: req.originalUrl,
                    scopes: [],
                })(req, res, next);
            }
            return next();
        });
    }
    if (options.acquireTokenForResources) {
        const resources = Object.entries(options.acquireTokenForResources);
        for (const resource of resources) {
            const [resourceName, resourceParams] = resource;
            resourceParams.routes.forEach((route) => {
                appRouter.use(route, (req, res, next) => {
                    if (req.authContext.getCachedTokenForResource(resourceName)) {
                        this.getLogger().verbose("Cached token found for resource endpoint");
                        return next();
                    }
                    this.getLogger().verbose("Acquiring token for resource: ", resourceName);
                    return acquireTokenHandler.call(this, { scopes: resourceParams.scopes }, { resourceName })(req, res, next);
                });
            });
        }
    }
    return appRouter;
}

module.exports = authenticateMiddleware;
//# sourceMappingURL=authenticateMiddleware.js.map
