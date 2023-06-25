/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
'use strict';

var BaseAuthProvider = require('./BaseAuthProvider.js');
var ConfigurationHelper = require('../config/ConfigurationHelper.js');
var FetchManager = require('../network/FetchManager.js');
var ConfigurationTypes = require('../config/ConfigurationTypes.js');
var authenticateMiddleware = require('../middleware/authenticateMiddleware.js');
var guardMiddleware = require('../middleware/guardMiddleware.js');
var errorMiddleware = require('../middleware/errorMiddleware.js');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class WebAppAuthProvider extends BaseAuthProvider.BaseAuthProvider {
    constructor(authConfig, msalConfig) {
        super(authConfig, msalConfig);
        this.webAppAuthConfig = authConfig;
    }
    /**
     * Static method to async initialize WebAppAuthProvider
     * @param {AuthenticateMiddlewareOptions} authConfig: configuration object
     * @returns {Promise<WebAppAuthProvider>}
     */
    static async initialize(authConfig) {
        ConfigurationHelper.ConfigurationHelper.validateAuthConfig(authConfig, ConfigurationTypes.AppType.WebApp);
        const msalConfig = ConfigurationHelper.ConfigurationHelper.getMsalConfiguration(authConfig);
        if (!msalConfig.auth.cloudDiscoveryMetadata && !msalConfig.auth.authorityMetadata) {
            const isB2C = authConfig.auth.authority && ConfigurationHelper.ConfigurationHelper.isB2CAuthority(authConfig.auth.authority);
            if (!isB2C) {
                const tenantId = authConfig.auth.authority ?
                    ConfigurationHelper.ConfigurationHelper.getTenantIdFromAuthority(authConfig.auth.authority) : "common";
                const [discoveryMetadata, authorityMetadata] = await Promise.all([
                    FetchManager.FetchManager.fetchCloudDiscoveryMetadata(tenantId),
                    FetchManager.FetchManager.fetchAuthorityMetadata(tenantId),
                ]);
                msalConfig.auth.cloudDiscoveryMetadata = discoveryMetadata;
                msalConfig.auth.authorityMetadata = authorityMetadata;
            }
        }
        return new WebAppAuthProvider(authConfig, msalConfig);
    }
    /**
     * Sets request context, default routes and handlers
     * @param {AuthenticateMiddlewareOptions} options: options to modify middleware behavior
     * @returns {RequestHandler}
     */
    authenticate(options = {
        protectAllRoutes: false,
    }) {
        return authenticateMiddleware.call(this, options);
    }
    /**
     * Guards a specified route with given options
     * @param {RouteGuardOptions} options: options to modify middleware behavior
     * @returns {RequestHandler}
     */
    guard(options = {
        forceLogin: true,
    }) {
        return guardMiddleware.call(this, options);
    }
    /**
     * Middleware to handle interaction required errors
     * @returns {ErrorRequestHandler}
     */
    interactionErrorHandler() {
        return errorMiddleware.call(this);
    }
}

exports.WebAppAuthProvider = WebAppAuthProvider;
//# sourceMappingURL=WebAppAuthProvider.js.map
