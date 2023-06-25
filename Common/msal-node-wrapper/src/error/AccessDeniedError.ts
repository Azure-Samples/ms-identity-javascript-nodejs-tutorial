/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AuthError, AccountInfo } from "@azure/msal-node";

/**
 * Contains string constants used by error codes and messages.
 */
export const AccessDeniedErrorMessage = {
    unauthorizedAccessError: {
        code: "401",
        desc: "Unauthorized"
    },
    forbiddenAccessError: {
        code: "403",
        desc: "Forbidden"
    }
};

/**
 * Error thrown when the user is not authorized to access a route
 */
export class AccessDeniedError extends AuthError {
    route?: string;
    account?: AccountInfo;

    constructor(errorCode: string, errorMessage?: string, route?: string, account?: AccountInfo) {
        super(errorCode, errorMessage);
        this.name = "AccessDeniedError";
        this.route = route;
        this.account = account;
        
        Object.setPrototypeOf(this, AccessDeniedError.prototype);
    }

    /**
     * Creates an error when access is unauthorized
     *
     * @returns {AccessDeniedError} Empty issuer error
     */
    static createUnauthorizedAccessError(route?: string, account?: AccountInfo): AccessDeniedError {
        return new AccessDeniedError(
            AccessDeniedErrorMessage.unauthorizedAccessError.code,
            AccessDeniedErrorMessage.unauthorizedAccessError.desc,
            route,
            account
        );
    }

    /**
     * Creates an error when the access is forbidden
     *
     * @returns {AccessDeniedError} Empty issuer error
     */
    static createForbiddenAccessError(route?: string, account?: AccountInfo): AccessDeniedError {
        return new AccessDeniedError(
            AccessDeniedErrorMessage.forbiddenAccessError.code,
            AccessDeniedErrorMessage.forbiddenAccessError.desc,
            route,
            account
        );
    }
}
