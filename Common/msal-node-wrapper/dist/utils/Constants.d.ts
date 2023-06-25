import { LoggerOptions } from "@azure/msal-common";
/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
export declare enum AppStages {
    SIGN_IN = "sign_in",
    SIGN_OUT = "sign_out",
    ACQUIRE_TOKEN = "acquire_token"
}
/**
 * String constants related to AAD Authority
 */
export declare const AADAuthorityConstants: {
    COMMON: string;
    ORGANIZATIONS: string;
    CONSUMERS: string;
};
export declare const OIDC_SCOPES: string[];
/**
 * Constants used in access control scenarios
 */
export declare const AccessControlConstants: {
    GROUPS: string;
    ROLES: string;
    CLAIM_NAMES: string;
    CLAIM_SOURCES: string;
    PAGINATION_LINK: string;
    GRAPH_MEMBERS_ENDPOINT: string;
    GRAPH_MEMBER_SCOPES: string;
};
/**
 * Various information constants
 */
export declare const InfoMessages: {
    REQUEST_FOR_RESOURCE: string;
    OVERAGE_OCCURRED: string;
};
/**
 * Various error constants
 */
export declare const ErrorMessages: {
    NOT_PERMITTED: string;
    INVALID_TOKEN: string;
    CANNOT_DETERMINE_APP_STAGE: string;
    CANNOT_VALIDATE_TOKEN: string;
    CSRF_TOKEN_MISMATCH: string;
    INTERACTION_REQUIRED: string;
    TOKEN_ACQUISITION_FAILED: string;
    TOKEN_RESPONSE_NULL: string;
    AUTH_CODE_URL_NOT_OBTAINED: string;
    TOKEN_NOT_FOUND: string;
    TOKEN_NOT_DECODED: string;
    TOKEN_NOT_VERIFIED: string;
    KEYS_NOT_OBTAINED: string;
    STATE_NOT_FOUND: string;
    USER_HAS_NO_ROLE: string;
    USER_NOT_IN_ROLE: string;
    USER_HAS_NO_GROUP: string;
    USER_NOT_IN_GROUP: string;
    METHOD_NOT_ALLOWED: string;
    RULE_NOT_FOUND: string;
    SESSION_NOT_FOUND: string;
    KEY_VAULT_CONFIG_NOT_FOUND: string;
    CANNOT_OBTAIN_CREDENTIALS_FROM_KEY_VAULT: string;
    SESSION_KEY_NOT_FOUND: string;
    AUTH_CODE_REQUEST_OBJECT_NOT_FOUND: string;
    ID_TOKEN_CLAIMS_NOT_FOUND: string;
    AUTH_CODE_RESPONSE_NOT_FOUND: string;
};
/**
 * Various configuration error constants
 */
export declare const ConfigurationErrorMessages: {
    AUTH_ROUTES_NOT_CONFIGURED: string;
    NO_PROTECTED_RESOURCE_CONFIGURED: string;
    NO_ACCESS_MATRIX_CONFIGURED: string;
    NO_CLIENT_ID: string;
    INVALID_CLIENT_ID: string;
    NO_TENANT_INFO: string;
    INVALID_TENANT_INFO: string;
    NO_CLIENT_CREDENTIAL: string;
    NO_REDIRECT_URI: string;
    NO_UNAUTHORIZED_ROUTE: string;
};
/**
 * For more information, visit: https://login.microsoftonline.com/error
 */
export declare const ErrorCodes: {
    65001: string;
    50076: string;
    50079: string;
    50001: string;
    65004: string;
    70011: string;
    700022: string;
    700020: string;
    90118: string;
};
/**
 * Default logger options
 */
export declare const DEFAULT_LOGGER_OPTIONS: LoggerOptions;
export declare const HttpMethods: {
    GET: string;
    POST: string;
    PUT: string;
    PATCH: string;
    DELETE: string;
    OPTIONS: string;
};
export declare const EMPTY_STRING = "";
//# sourceMappingURL=Constants.d.ts.map