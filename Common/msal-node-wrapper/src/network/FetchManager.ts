/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { StringUtils } from "@azure/msal-common";
import { AccessControlConstants, ErrorMessages } from "../utils/Constants";

export class FetchManager {
    /**
     * Calls a resource endpoint
     * @param {string} endpoint: URL of the endpoint to be called
     * @returns {Promise<any>}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    static callApiEndpoint = async (endpoint: string, options?: AxiosRequestConfig): Promise<any> => {
        try {
            const response: AxiosResponse = await axios.get(endpoint, options);
            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Calls a resource endpoint with a raw access token
     * using the authorization bearer token scheme
     * @param {string} endpoint: URL of the endpoint to be called
     * @param {string} accessToken: Raw access token
     * @returns {Promise<any>}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static callApiEndpointWithToken = async (endpoint: string, accessToken: string): Promise<any> => {
        if (StringUtils.isEmptyObj(accessToken)) {
            throw new Error(ErrorMessages.TOKEN_NOT_FOUND);
        }

        const options: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        try {
            const response = await FetchManager.callApiEndpoint(endpoint, options);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    static async fetchCloudDiscoveryMetadata(tenantId: string): Promise<string> {
        const endpoint = "https://login.microsoftonline.com/common/discovery/instance";

        try {
            const response = await FetchManager.callApiEndpoint(endpoint, {
                params: {
                    "api-version": "1.1",
                    "authorization_endpoint": `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`
                }
            });
            const cloudDiscoveryMetadata = JSON.stringify(response.data);
            return cloudDiscoveryMetadata;
        } catch (error) {
            throw error;
        }
    }

    static async fetchAuthorityMetadata(tenantId: string): Promise<string> {
        const endpoint = `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`;

        try {
            const response = await FetchManager.callApiEndpoint(endpoint);
            const authorityMetadata = JSON.stringify(response.data);
            return authorityMetadata;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Handles queries against Microsoft Graph that return multiple pages of data
     * @param {string} accessToken: access token required by endpoint
     * @param {string} nextPage: next page link
     * @param {Array} data: stores data from each page
     * @returns {Promise<string[]>}
     */
    static handlePagination = async (accessToken: string, nextPage: string, data: string[] = []): Promise<string[]> => {
        try {
            const graphResponse = await (await FetchManager.callApiEndpointWithToken(nextPage, accessToken)).data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            graphResponse["value"].map((v: any) => data.push(v.id));

            if (graphResponse[AccessControlConstants.PAGINATION_LINK]) {
                return await FetchManager.handlePagination(
                    accessToken,
                    graphResponse[AccessControlConstants.PAGINATION_LINK],
                    data
                );
            } else {
                return data;
            }
        } catch (error) {
            throw error;
        }
    };
}
