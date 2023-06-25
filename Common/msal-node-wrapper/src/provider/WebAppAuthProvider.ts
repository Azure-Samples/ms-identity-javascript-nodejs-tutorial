/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ErrorRequestHandler, RequestHandler } from "express";
import { Configuration } from "@azure/msal-node";
import { BaseAuthProvider } from "./BaseAuthProvider";
import { ConfigurationHelper } from "../config/ConfigurationHelper";
import { FetchManager } from "../network/FetchManager";
import { AuthConfig, WebAppAuthConfig, AppType } from "../config/ConfigurationTypes";
import { AuthenticateMiddlewareOptions, RouteGuardOptions } from "../middleware/MiddlewareOptions";
import authenticateMiddleware from "../middleware/authenticateMiddleware";
import guardMiddleware from "../middleware/guardMiddleware";
import errorMiddleware from "../middleware/errorMiddleware";

export class WebAppAuthProvider extends BaseAuthProvider {
    webAppAuthConfig: WebAppAuthConfig;

    private constructor(authConfig: AuthConfig, msalConfig: Configuration) {
        super(authConfig, msalConfig);
        this.webAppAuthConfig = authConfig as WebAppAuthConfig;
    }

    /**
     * Static method to async initialize WebAppAuthProvider
     * @param {AuthenticateMiddlewareOptions} authConfig: configuration object
     * @returns {Promise<WebAppAuthProvider>}
     */
    static async initialize(authConfig: AuthConfig): Promise<WebAppAuthProvider> {
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
    authenticate(options: AuthenticateMiddlewareOptions = {
        protectAllRoutes: false,
    }): RequestHandler {
        return authenticateMiddleware.call(this, options);
    }

    /**
     * Guards a specified route with given options
     * @param {RouteGuardOptions} options: options to modify middleware behavior
     * @returns {RequestHandler}
     */
    guard(options: RouteGuardOptions = {
        forceLogin: true,
    }): RequestHandler {
        return guardMiddleware.call(this, options);
    }

    /**
     * Middleware to handle interaction required errors
     * @returns {ErrorRequestHandler}
     */
    interactionErrorHandler(): ErrorRequestHandler {
        return errorMiddleware.call(this);
    }
}
