/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
import { InteractionRequiredAuthError } from '@azure/msal-node';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Error thrown when user interaction is required.
 */
class InteractionRequiredError extends InteractionRequiredAuthError {
    constructor(errorCode, errorMessage, subError, originalRequest) {
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

export { InteractionRequiredError };
//# sourceMappingURL=InteractionRequiredError.esm.js.map
