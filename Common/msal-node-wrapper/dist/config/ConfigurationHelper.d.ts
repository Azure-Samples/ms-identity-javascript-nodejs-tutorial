import { Configuration } from "@azure/msal-node";
import { AuthConfig, AppType, ProtectedResourcesMap } from "./ConfigurationTypes";
export declare class ConfigurationHelper {
    /**
     * Maps the custom configuration object to configuration
     * object expected by MSAL Node ConfidentialClientApplication class
     * @param {AuthConfig} authConfig: configuration object
     * @returns {Configuration}
     */
    static getMsalConfiguration(authConfig: AuthConfig): Configuration;
    /**
     * Validates the fields in the config object
     * @param {AuthConfig} authConfig: configuration object
     * @param {AppType} appType: type of application
     */
    static validateAuthConfig(authConfig: AuthConfig, appType: AppType): void;
    /**
     * Indicates whether the given authority is a B2C authority
     * @param authority
     * @returns
     */
    static isB2CAuthority(authority: string): boolean;
    /**
     * Returns the tenantId associated with the authority string
     * @param {string} authority: authority string
     * @returns {string}
     */
    static getTenantIdFromAuthority(authority: string): string;
    /**
     * Returns the instance associated with the authority string
     * @param {string} authority: authority string
     * @returns {string}
     */
    static getInstanceFromAuthority(authority: string): string;
    /**
     * Util method to get the resource name for a given scope(s)
     * @param {Array} scopes: an array of scopes from the token response
     * @param {ProtectedResourcesMap} protectedResources: application authentication parameters
     * @returns {string}
     */
    static getResourceNameFromScopes(scopes: string[], protectedResources: ProtectedResourcesMap): string;
    /**
     * Util method to strip the default OIDC scopes from a given scopes list
     * @param {Array} scopesList: full list of scopes for this resource
     * @returns {Array}
     */
    static getEffectiveScopes(scopesList: string[]): string[];
    /**
     * Verifies if a given string is GUID
     * @param {string} guid: string to be verified as GUID
     * @returns {boolean}
     */
    static isGuid(guid: string): boolean;
}
//# sourceMappingURL=ConfigurationHelper.d.ts.map