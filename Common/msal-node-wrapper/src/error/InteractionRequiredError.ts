/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { InteractionRequiredAuthError } from "@azure/msal-node";
import { LoginOptions, TokenRequestOptions } from "../middleware/MiddlewareOptions";

/**
 * Error thrown when user interaction is required.
 */
export class InteractionRequiredError extends InteractionRequiredAuthError {
    requestOptions: LoginOptions;

    constructor(errorCode: string, errorMessage?: string, subError?: string, originalRequest?: TokenRequestOptions) {
        super(errorCode, errorMessage, subError);
        this.name = "InteractionRequiredError";
        this.requestOptions = {
            scopes: originalRequest?.scopes || [],
            claims: originalRequest?.claims,
            state: originalRequest?.state,
            sid: originalRequest?.sid,
            loginHint: originalRequest?.loginHint,
            domainHint: originalRequest?.domainHint,
            extraQueryParameters: originalRequest?.extraQueryParameters,
            extraScopesToConsent: originalRequest?.extraScopesToConsent,
            tokenBodyParameters: originalRequest?.tokenBodyParameters,
            tokenQueryParameters: originalRequest?.tokenQueryParameters,
        };
        
        Object.setPrototypeOf(this, InteractionRequiredError.prototype);
    }
}
