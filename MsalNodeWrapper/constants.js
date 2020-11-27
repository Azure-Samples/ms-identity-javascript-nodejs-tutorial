/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
exports.AppStages = {
    SIGN_IN: "sign_in",
    SIGN_OUT: "sign_out",
    ACQUIRE_TOKEN: "acquire_token",
    SIGN_UP_SIGN_IN: "sign_up_sign_in",
    RESET_PASSWORD: "reset_password",
    EDIT_PROFILE: "edit_profile"
};

/**
 * OpenID Connect scopes
 */
exports.OIDCScopes = {
    OPENID: "openid",
    PROFILE: "profile",
    OFFLINE_ACCESS: "offline_access"
}

/**
 * String constants related to AAD Authority
 */
exports.AADAuthorityConstants = {
    COMMON: "common",
    ORGANIZATIONS: "organizations",  
    CONSUMERS: "consumers"
}

/**
 * Global AAD cloud authority
 */
exports.AuthorityStrings = {
    AAD: "https://login.microsoftonline.com/",
}

/**
 * Allowed values for prompt
 */
exports.PromptValue = {
    LOGIN: "login",
    SELECT_ACCOUNT: "select_account",
    CONSENT: "consent",
    NONE: "none",
};

/**
 * Credential Type stored in the cache
 */
exports.CredentialType = {
    ID_TOKEN: "IdToken",
    ACCESS_TOKEN: "AccessToken",
    REFRESH_TOKEN: "RefreshToken",
}

/**
 * Allowed fields in JSON configuration file
 */
exports.JsonConfiguration = {
    CREDENTIALS: "credentials",
    CONFIGURATION: "configuration",
    RESOURCES: "resources",
    POLICIES: "policies",
    PROTECTED: "protected"
}