import { AxiosRequestConfig } from "axios";
export declare class FetchManager {
    /**
     * Calls a resource endpoint
     * @param {string} endpoint: URL of the endpoint to be called
     * @returns {Promise<any>}
     */
    static callApiEndpoint: (endpoint: string, options?: AxiosRequestConfig) => Promise<any>;
    /**
     * Calls a resource endpoint with a raw access token
     * using the authorization bearer token scheme
     * @param {string} endpoint: URL of the endpoint to be called
     * @param {string} accessToken: Raw access token
     * @returns {Promise<any>}
     */
    static callApiEndpointWithToken: (endpoint: string, accessToken: string) => Promise<any>;
    static fetchCloudDiscoveryMetadata(tenantId: string): Promise<string>;
    static fetchAuthorityMetadata(tenantId: string): Promise<string>;
    /**
     * Handles queries against Microsoft Graph that return multiple pages of data
     * @param {string} accessToken: access token required by endpoint
     * @param {string} nextPage: next page link
     * @param {Array} data: stores data from each page
     * @returns {Promise<string[]>}
     */
    static handlePagination: (accessToken: string, nextPage: string, data?: string[]) => Promise<string[]>;
}
//# sourceMappingURL=FetchManager.d.ts.map