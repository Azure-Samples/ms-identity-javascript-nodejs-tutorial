/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
import { BaseAuthProvider } from './BaseAuthProvider.esm.js';
import { ConfigurationHelper } from '../config/ConfigurationHelper.esm.js';
import { FetchManager } from '../network/FetchManager.esm.js';
import { AppType } from '../config/ConfigurationTypes.esm.js';
import authenticateMiddleware from '../middleware/authenticateMiddleware.esm.js';
import guardMiddleware from '../middleware/guardMiddleware.esm.js';
import errorMiddleware from '../middleware/errorMiddleware.esm.js';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class WebAppAuthProvider extends BaseAuthProvider {
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
        ConfigurationHelper.validateAuthConfig(authConfig, AppType.WebApp);
        const msalConfig = ConfigurationHelper.getMsalConfiguration(authConfig);
        if (!msalConfig.auth.cloudDiscoveryMetadata && !msalConfig.auth.authorityMetadata) {
            const isB2C = authConfig.auth.authority && ConfigurationHelper.isB2CAuthority(authConfig.auth.authority);
            if (!isB2C) {
                const tenantId = authConfig.auth.authority ?
                    ConfigurationHelper.getTenantIdFromAuthority(authConfig.auth.authority) : "common";
                const [discoveryMetadata, authorityMetadata] = await Promise.all([
                    FetchManager.fetchCloudDiscoveryMetadata(tenantId),
                    FetchManager.fetchAuthorityMetadata(tenantId),
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

export { WebAppAuthProvider };
//# sourceMappingURL=WebAppAuthProvider.esm.js.map
