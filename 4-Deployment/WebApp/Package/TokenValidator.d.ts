import { TokenClaims } from '@azure/msal-common';
import { Configuration } from '@azure/msal-node';
import { AppSettings } from './Types';
export declare class TokenValidator {
    appSettings: AppSettings;
    msalConfig: Configuration;
    constructor(appSettings: AppSettings, msalConfig: Configuration);
    verifyTokenSignature: (authToken: string) => Promise<TokenClaims | boolean>;
    /**
     *
     * @param {string} idToken: raw Id token
     */
    validateIdToken: (idToken: string) => Promise<boolean>;
    /**
     * Validates the id token for a set of claims
     * @param {TokenClaims} idTokenClaims: decoded id token claims
     */
    validateIdTokenClaims: (idTokenClaims: TokenClaims) => boolean;
    /**
     * Validates the access token for signature and against a predefined set of claims
     * @param {string} accessToken: raw JWT token
     * @param {string} protectedRoute: used for checking scope
     */
    validateAccessToken: (accessToken: string, protectedRoute: string) => Promise<boolean>;
    /**
     *
     * @param {TokenClaims} verifiedToken
     * @param {string} protectedRoute
     */
    validateAccessTokenClaims: (verifiedToken: TokenClaims, protectedRoute: string) => boolean;
    /**
     * Fetches signing keys of an access token
     * from the authority discovery endpoint
     * @param {Object} header
     */
    private getSigningKeys;
}
