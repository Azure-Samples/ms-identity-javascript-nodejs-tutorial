/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LoggerOptions, LogLevel, OIDC_DEFAULT_SCOPES } from "@azure/msal-common";

/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
export enum AppStages {
    SIGN_IN = "sign_in",
    SIGN_OUT = "sign_out",
    ACQUIRE_TOKEN = "acquire_token",
}

/**
 * String constants related to AAD Authority
 */
export const AADAuthorityConstants = {
    COMMON: "common",
    ORGANIZATIONS: "organizations",
    CONSUMERS: "consumers",
};

export const OIDC_SCOPES = [...OIDC_DEFAULT_SCOPES, "email"];

/**
 * Constants used in access control scenarios
 */
export const AccessControlConstants = {
    GROUPS: "groups",
    ROLES: "roles",
    CLAIM_NAMES: "_claim_name",
    CLAIM_SOURCES: "_claim_sources",
    PAGINATION_LINK: "@odata.nextLink",
    GRAPH_MEMBERS_ENDPOINT: "https://graph.microsoft.com/v1.0/me/memberOf",
    GRAPH_MEMBER_SCOPES: "User.Read GroupMember.Read.All",
};

/**
 * Various information constants
 */
export const InfoMessages = {
    REQUEST_FOR_RESOURCE: "Request made to web API",
    OVERAGE_OCCURRED: "User has too many groups. Groups overage claim occurred",
};

/**
 * Various error constants
 */
export const ErrorMessages = {
    NOT_PERMITTED: "Not permitted",
    INVALID_TOKEN: "Invalid token",
    CANNOT_DETERMINE_APP_STAGE: "Cannot determine application stage",
    CANNOT_VALIDATE_TOKEN: "Cannot validate token",
    CSRF_TOKEN_MISMATCH: "CSRF token in response does not match to original request",
    INTERACTION_REQUIRED: "interaction_required",
    TOKEN_ACQUISITION_FAILED: "Token acquisition failed",
    TOKEN_RESPONSE_NULL: "Token response is null",
    AUTH_CODE_URL_NOT_OBTAINED: "Authorization code url cannot be obtained",
    TOKEN_NOT_FOUND: "No token found",
    TOKEN_NOT_DECODED: "Token cannot be decoded",
    TOKEN_NOT_VERIFIED: "Token cannot be verified",
    KEYS_NOT_OBTAINED: "Signing keys cannot be obtained",
    STATE_NOT_FOUND: "State not found",
    USER_HAS_NO_ROLE: "User does not have any roles",
    USER_NOT_IN_ROLE: "User does not have this role",
    USER_HAS_NO_GROUP: "User does not have any groups",
    USER_NOT_IN_GROUP: "User does not have this group",
    METHOD_NOT_ALLOWED: "Method not allowed for this route",
    RULE_NOT_FOUND: "No rule found for this route",
    SESSION_NOT_FOUND: "No session found for this request",
    KEY_VAULT_CONFIG_NOT_FOUND: "No coordinates found for Key Vault",
    CANNOT_OBTAIN_CREDENTIALS_FROM_KEY_VAULT: "Cannot obtain credentials from Key Vault",
    SESSION_KEY_NOT_FOUND: "No session key found in session. Cannot encrypt state data",
    AUTH_CODE_REQUEST_OBJECT_NOT_FOUND: "No auth code request object found in session",
    ID_TOKEN_CLAIMS_NOT_FOUND: "No id token claims found in session",
    AUTH_CODE_RESPONSE_NOT_FOUND: "No authorization code found in the response from service",
};

/**
 * Various configuration error constants
 */
export const ConfigurationErrorMessages = {
    AUTH_ROUTES_NOT_CONFIGURED: "Authentication routes are not defined. Ensure that the application settings are configured properly.",
    NO_PROTECTED_RESOURCE_CONFIGURED: "No protected resource is configured to acquire a token for. Ensure that the application settings are configured properly.",
    NO_ACCESS_MATRIX_CONFIGURED: "No access matrix is configured to control access for. Ensure that the application settings are configured properly.",
    NO_CLIENT_ID: "No clientId provided!",
    INVALID_CLIENT_ID: "Invalid clientId!",
    NO_TENANT_INFO: "No tenant info provided!",
    INVALID_TENANT_INFO: "Invalid tenant info!",
    NO_CLIENT_CREDENTIAL: "No client credential provided!",
    NO_REDIRECT_URI: "No redirect URI provided!",
    NO_UNAUTHORIZED_ROUTE: "No unauthorized route provided!",
};

/**
 * For more information, visit: https://login.microsoftonline.com/error
 */
export const ErrorCodes = {
    65001: "AADSTS65001", // consent required
    50076: "AADSTS50076", // mfa required
    50079: "AADSTS50079", // mfa enrollment required
    50001: "AADSTS50001", // invalid resource uri
    65004: "AADSTS65004", // user declined consent
    70011: "AADSTS70011", // invalid scope
    700022: "AADSTS700022", // multiple resources
    700020: "AADSTS700020", // interaction required
    90118: "AADB2C90118", // password forgotten (B2C)
};

/**
 * Default logger options
 */
export const DEFAULT_LOGGER_OPTIONS: LoggerOptions = {
    loggerCallback: (_logLevel, message, containsPii) => {
        if (containsPii) {
            return;
        }
        // eslint-disable-next-line no-console
        console.info(message);
    },
    piiLoggingEnabled: false,
    logLevel: LogLevel.Info,
};

export const HttpMethods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
    OPTIONS: "OPTIONS",
};

export const EMPTY_STRING = "";
