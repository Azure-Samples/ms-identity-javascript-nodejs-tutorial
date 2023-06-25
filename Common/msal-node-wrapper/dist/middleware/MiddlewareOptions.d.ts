import { CommonEndSessionRequest, TokenClaims } from "@azure/msal-common";
import { AuthorizationUrlRequest, AuthorizationCodeRequest, AccountInfo } from "@azure/msal-node";
import { ProtectedResourcesMap } from "../config/ConfigurationTypes";
export type AuthenticateMiddlewareOptions = {
    protectAllRoutes?: boolean;
    acquireTokenForResources?: ProtectedResourcesMap;
};
export type LoginOptions = Pick<AuthorizationCodeRequest, "scopes" | "claims" | "tokenBodyParameters" | "tokenQueryParameters"> & Pick<AuthorizationUrlRequest, "scopes" | "account" | "loginHint" | "domainHint" | "state" | "extraQueryParameters" | "extraScopesToConsent" | "prompt" | "sid"> & {
    postLoginRedirectUri?: string;
    postFailureRedirectUri?: string;
};
export type LogoutOptions = Pick<CommonEndSessionRequest, "account" | "state" | "postLogoutRedirectUri" | "logoutHint" | "extraQueryParameters"> & {
    postLogoutRedirectUri?: string;
    idpLogout?: boolean;
    clearCache?: boolean;
};
export type TokenRequestOptions = LoginOptions & {
    account?: AccountInfo;
};
export type TokenRequestMiddlewareOptions = {
    resourceName: string;
};
export type RouteGuardOptions = {
    forceLogin?: boolean;
    postLoginRedirectUri?: string;
    postFailureRedirectUri?: string;
    idTokenClaims?: IdTokenClaims;
};
export type AppState = {
    redirectTo: string;
    customState?: string;
};
export type IdTokenClaims = TokenClaims & {
    aud?: string;
    roles?: string[];
    groups?: string[];
    _claim_names?: string[];
    _claim_sources?: string[];
    xms_cc?: string;
    acrs?: string[];
    [key: string]: string | number | string[] | object | undefined | unknown;
};
//# sourceMappingURL=MiddlewareOptions.d.ts.map