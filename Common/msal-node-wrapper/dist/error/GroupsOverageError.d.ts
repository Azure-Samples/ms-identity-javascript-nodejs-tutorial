import { AccountInfo, AuthError } from "@azure/msal-node";
/**
 * Error thrown when groups overage claim is present in the ID token.
 */
export declare class GroupsOverageError extends AuthError {
    account?: AccountInfo;
    constructor(errorCode: string, errorMessage?: string, account?: AccountInfo);
}
//# sourceMappingURL=GroupsOverageError.d.ts.map