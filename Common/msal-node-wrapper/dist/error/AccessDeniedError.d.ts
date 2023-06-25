import { AuthError, AccountInfo } from "@azure/msal-node";
/**
 * Contains string constants used by error codes and messages.
 */
export declare const AccessDeniedErrorMessage: {
    unauthorizedAccessError: {
        code: string;
        desc: string;
    };
    forbiddenAccessError: {
        code: string;
        desc: string;
    };
};
/**
 * Error thrown when the user is not authorized to access a route
 */
export declare class AccessDeniedError extends AuthError {
    route?: string;
    account?: AccountInfo;
    constructor(errorCode: string, errorMessage?: string, route?: string, account?: AccountInfo);
    /**
     * Creates an error when access is unauthorized
     *
     * @returns {AccessDeniedError} Empty issuer error
     */
    static createUnauthorizedAccessError(route?: string, account?: AccountInfo): AccessDeniedError;
    /**
     * Creates an error when the access is forbidden
     *
     * @returns {AccessDeniedError} Empty issuer error
     */
    static createForbiddenAccessError(route?: string, account?: AccountInfo): AccessDeniedError;
}
//# sourceMappingURL=AccessDeniedError.d.ts.map