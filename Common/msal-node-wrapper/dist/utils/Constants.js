/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
'use strict';

var Constants = require('../node_modules/@azure/msal-common/dist/utils/Constants.js');
var Logger = require('../node_modules/@azure/msal-common/dist/logger/Logger.js');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
exports.AppStages = void 0;
(function (AppStages) {
    AppStages["SIGN_IN"] = "sign_in";
    AppStages["SIGN_OUT"] = "sign_out";
    AppStages["ACQUIRE_TOKEN"] = "acquire_token";
})(exports.AppStages || (exports.AppStages = {}));
const OIDC_SCOPES = [...Constants.OIDC_DEFAULT_SCOPES, "email"];
/**
 * Constants used in access control scenarios
 */
const AccessControlConstants = {
    GROUPS: "groups",
    ROLES: "roles",
    CLAIM_NAMES: "_claim_name",
    CLAIM_SOURCES: "_claim_sources",
    PAGINATION_LINK: "@odata.nextLink",
    GRAPH_MEMBERS_ENDPOINT: "https://graph.microsoft.com/v1.0/me/memberOf",
    GRAPH_MEMBER_SCOPES: "User.Read GroupMember.Read.All",
};
/**
 * Various error constants
 */
const ErrorMessages = {
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
const ConfigurationErrorMessages = {
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
 * Default logger options
 */
const DEFAULT_LOGGER_OPTIONS = {
    loggerCallback: (_logLevel, message, containsPii) => {
        if (containsPii) {
            return;
        }
        // eslint-disable-next-line no-console
        console.info(message);
    },
    piiLoggingEnabled: false,
    logLevel: Logger.LogLevel.Info,
};
const EMPTY_STRING = "";

exports.AccessControlConstants = AccessControlConstants;
exports.ConfigurationErrorMessages = ConfigurationErrorMessages;
exports.DEFAULT_LOGGER_OPTIONS = DEFAULT_LOGGER_OPTIONS;
exports.EMPTY_STRING = EMPTY_STRING;
exports.ErrorMessages = ErrorMessages;
exports.OIDC_SCOPES = OIDC_SCOPES;
//# sourceMappingURL=Constants.js.map
