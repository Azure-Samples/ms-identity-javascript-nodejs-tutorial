import { InteractionRequiredAuthError } from "@azure/msal-node";
import { LoginOptions, TokenRequestOptions } from "../middleware/MiddlewareOptions";
/**
 * Error thrown when user interaction is required.
 */
export declare class InteractionRequiredError extends InteractionRequiredAuthError {
    requestOptions: LoginOptions;
    constructor(errorCode: string, errorMessage?: string, subError?: string, originalRequest?: TokenRequestOptions);
}
//# sourceMappingURL=InteractionRequiredError.d.ts.map