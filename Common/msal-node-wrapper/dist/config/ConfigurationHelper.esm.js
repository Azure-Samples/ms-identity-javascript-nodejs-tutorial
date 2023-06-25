/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
import { DEFAULT_LOGGER_OPTIONS, ConfigurationErrorMessages, OIDC_SCOPES } from '../utils/Constants.esm.js';
import { AppType } from './ConfigurationTypes.esm.js';
import { StringUtils } from '../node_modules/@azure/msal-common/dist/utils/StringUtils.esm.js';
import { UrlString } from '../node_modules/@azure/msal-common/dist/url/UrlString.esm.js';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class ConfigurationHelper {
    /**
     * Maps the custom configuration object to configuration
     * object expected by MSAL Node ConfidentialClientApplication class
     * @param {AuthConfig} authConfig: configuration object
     * @returns {Configuration}
     */
    static getMsalConfiguration(authConfig) {
        return {
            auth: {
                ...authConfig.auth,
                authority: authConfig.auth?.authority ? authConfig.auth.authority : "https://login.microsoftonline.com/common",
            },
            system: {
                ...authConfig.system,
                loggerOptions: authConfig.system?.loggerOptions ? authConfig.system.loggerOptions : DEFAULT_LOGGER_OPTIONS,
            },
        };
    }
    /**
     * Validates the fields in the config object
     * @param {AuthConfig} authConfig: configuration object
     * @param {AppType} appType: type of application
     */
    static validateAuthConfig(authConfig, appType) {
        switch (appType) {
            case AppType.WebApp:
                if (StringUtils.isEmpty(authConfig.auth.redirectUri)) {
                    throw new Error(ConfigurationErrorMessages.NO_REDIRECT_URI);
                }
                break;
        }
    }
    /**
     * Indicates whether the given authority is a B2C authority
     * @param authority
     * @returns
     */
    static isB2CAuthority(authority) {
        return authority.includes("b2clogin.com/");
    }
    /**
     * Returns the tenantId associated with the authority string
     * @param {string} authority: authority string
     * @returns {string}
     */
    static getTenantIdFromAuthority(authority) {
        const canonicalAuthorityUri = UrlString.canonicalizeUri(authority);
        return canonicalAuthorityUri.split("/").slice(-2)[0];
    }
    /**
     * Returns the instance associated with the authority string
     * @param {string} authority: authority string
     * @returns {string}
     */
    static getInstanceFromAuthority(authority) {
        const canonicalAuthorityUri = UrlString.canonicalizeUri(authority);
        return canonicalAuthorityUri.split("/").slice(-3)[0];
    }
    /**
     * Util method to get the resource name for a given scope(s)
     * @param {Array} scopes: an array of scopes from the token response
     * @param {ProtectedResourcesMap} protectedResources: application authentication parameters
     * @returns {string}
     */
    static getResourceNameFromScopes(scopes, protectedResources) {
        const effectiveScopes = this.getEffectiveScopes(scopes).map((scope) => scope.toLowerCase());
        const index = Object.values(protectedResources).findIndex((resourceParams) => effectiveScopes.every((scope) => resourceParams.scopes.includes(scope.toLowerCase())));
        const resourceName = Object.keys(protectedResources)[index];
        return resourceName;
    }
    /**
     * Util method to strip the default OIDC scopes from a given scopes list
     * @param {Array} scopesList: full list of scopes for this resource
     * @returns {Array}
     */
    static getEffectiveScopes(scopesList) {
        const effectiveScopesList = scopesList.filter(scope => !OIDC_SCOPES.includes(scope));
        return effectiveScopesList;
    }
    /**
     * Verifies if a given string is GUID
     * @param {string} guid: string to be verified as GUID
     * @returns {boolean}
     */
    static isGuid(guid) {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regexGuid.test(guid);
    }
}

export { ConfigurationHelper };
//# sourceMappingURL=ConfigurationHelper.esm.js.map
