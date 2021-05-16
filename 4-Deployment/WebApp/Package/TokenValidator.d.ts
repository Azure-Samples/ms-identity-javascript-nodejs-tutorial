import { Configuration } from '@azure/msal-node';
import { AppSettings } from './Types';
export declare class TokenValidator {
    appSettings: AppSettings;
    msalConfig: Configuration;
    constructor(appSettings: AppSettings, msalConfig: Configuration);
    /**
     * Validates the id token for a set of claims
     * @param {Object} idTokenClaims: decoded id token claims
     */
    validateIdToken: (idTokenClaims: any) => boolean;
    /**
     * Validates the access token for signature and against a predefined set of claims
     * @param {string} accessToken: raw JWT token
     * @param {string} protectedRoute: used for checking scope
     */
    validateAccessToken: (accessToken: any, protectedRoute: any) => Promise<boolean>;
    /**
     * Fetches signing keys of an access token
     * from the authority discovery endpoint
     * @param {string} header
     */
    private getSigningKeys;
}
