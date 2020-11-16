/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * 
 */
exports.AppStages = {
    SIGN_IN: "signIn",
    SIGN_OUT: "signOut",
    ACQUIRE_TOKEN: "acquireToken",
    ACQUIRE_TOKEN_SILENT: "acquireTokenSilent",
    SIGN_UP_SIGN_IN: "signUpSignIn",
    RESET_PASSWORD: "resetPassword",
    EDIT_PROFILE: "editProfile"
};

/**
 * 
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
 * Keys in the hashParams sent by AAD Server
 */
exports.AADServerParamKeys = {
    CLIENT_ID: "client_id",
    REDIRECT_URI: "redirect_uri",
    RESPONSE_TYPE: "response_type",
    RESPONSE_MODE: "response_mode",
    GRANT_TYPE: "grant_type",
    SCOPE: "scope",
    ERROR_DESCRIPTION: "error_description",
    ACCESS_TOKEN: "access_token",
    ID_TOKEN: "id_token",
    REFRESH_TOKEN: "refresh_token",
    EXPIRES_IN: "expires_in",
    STATE: "state",
    NONCE: "nonce",
    PROMPT: "prompt",
    CODE: "code",
    CODE_CHALLENGE: "code_challenge",
    CODE_CHALLENGE_METHOD: "code_challenge_method",
    CODE_VERIFIER: "code_verifier",
    CLIENT_REQUEST_ID: "client-request-id",
    POST_LOGOUT_URI: "post_logout_redirect_uri",
    CLIENT_SECRET: "client_secret",
    CLIENT_ASSERTION: "client_assertion",
    CLIENT_ASSERTION_TYPE: "client_assertion_type",
    TOKEN_TYPE: "token_type",
    OBO_ASSERTION: "assertion",
    REQUESTED_TOKEN_USE: "requested_token_use",
    ON_BEHALF_OF: "on_behalf_of",
}

/**
 * 
 */
exports.AuthorityStrings = {
    AAD: "https://login.microsoftonline.com/",
    B2C: ""
}

/**
 * allowed values for prompt
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