/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
export declare const AppStages: {
    SIGN_IN: string;
    SIGN_OUT: string;
    ACQUIRE_TOKEN: string;
};
/**
 * Allowed fields in JSON configuration file
 */
export declare const JsonConfiguration: {
    CREDENTIALS: string;
    CONFIGURATION: string;
    RESOURCES: string;
    POLICIES: string;
    PROTECTED: string;
};
/**
 * Various error constants
 */
export declare const ErrorMessages: {
    NOT_PERMITTED: string;
    INVALID_TOKEN: string;
    CANNOT_DETERMINE_APP_STAGE: string;
    NONCE_MISMATCH: string;
    INTERACTION_REQUIRED: string;
    TOKEN_NOT_FOUND: string;
    TOKEN_NOT_DECODED: string;
    TOKEN_NOT_VERIFIED: string;
    KEYS_NOT_OBTAINED: string;
    STATE_NOT_FOUND: string;
};
/**
 * For more information, visit: https://login.microsoftonline.com/error
 */
export declare const ErrorCodes: {
    65001: string;
};
