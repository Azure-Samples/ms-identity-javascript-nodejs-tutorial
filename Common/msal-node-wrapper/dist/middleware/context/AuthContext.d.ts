import { Request, Response, NextFunction, RequestHandler } from "express";
import { AccountInfo } from "@azure/msal-node";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { LoginOptions, LogoutOptions, TokenRequestOptions } from "../MiddlewareOptions";
type RequestContext = {
    req: Request;
    res: Response;
    next: NextFunction;
};
export declare class AuthContext {
    private provider;
    private context;
    constructor(provider: WebAppAuthProvider, context: RequestContext);
    /**
     * Initiates a login flow with given options
     * @param {LoginOptions} options: options to modify the login request
     * @returns {RequestHandler}
     */
    login(options?: LoginOptions): RequestHandler;
    /**
     * Initiates a logout flow and destroys the current session
     * @param {LogoutOptions} options: options to modify logout request
     * @returns {RequestHandler}
     */
    logout(options?: LogoutOptions): RequestHandler;
    /**
     * Acquires an access token for given request parameters
     * @param {TokenRequestOptions} options: options to modify token request
     * @returns {RequestHandler}
     */
    acquireToken(options?: TokenRequestOptions): RequestHandler;
    /**
     * Returns the current user account from session
     * @returns {AccountInfo} account object
     */
    getAccount(): AccountInfo | undefined;
    /**
     * Returns true if session contains user account
     * @returns {boolean} authentication status
     */
    isAuthenticated(): boolean;
    /**
     * Returns the cached token for a given resource
     * @param {string} resourceName: name of the resource to retrieve token for
     * @returns {string | null} cached access token
     */
    getCachedTokenForResource(resourceName: string): string | null;
}
export {};
//# sourceMappingURL=AuthContext.d.ts.map