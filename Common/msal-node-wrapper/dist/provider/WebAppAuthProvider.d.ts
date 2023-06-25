import { ErrorRequestHandler, RequestHandler } from "express";
import { BaseAuthProvider } from "./BaseAuthProvider";
import { AuthConfig, WebAppAuthConfig } from "../config/ConfigurationTypes";
import { AuthenticateMiddlewareOptions, RouteGuardOptions } from "../middleware/MiddlewareOptions";
export declare class WebAppAuthProvider extends BaseAuthProvider {
    webAppAuthConfig: WebAppAuthConfig;
    private constructor();
    /**
     * Static method to async initialize WebAppAuthProvider
     * @param {AuthenticateMiddlewareOptions} authConfig: configuration object
     * @returns {Promise<WebAppAuthProvider>}
     */
    static initialize(authConfig: AuthConfig): Promise<WebAppAuthProvider>;
    /**
     * Sets request context, default routes and handlers
     * @param {AuthenticateMiddlewareOptions} options: options to modify middleware behavior
     * @returns {RequestHandler}
     */
    authenticate(options?: AuthenticateMiddlewareOptions): RequestHandler;
    /**
     * Guards a specified route with given options
     * @param {RouteGuardOptions} options: options to modify middleware behavior
     * @returns {RequestHandler}
     */
    guard(options?: RouteGuardOptions): RequestHandler;
    /**
     * Middleware to handle interaction required errors
     * @returns {ErrorRequestHandler}
     */
    interactionErrorHandler(): ErrorRequestHandler;
}
//# sourceMappingURL=WebAppAuthProvider.d.ts.map