/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    UrlString,
    Constants,
} from '@azure/msal-common';

import { 
    Configuration,
    ICachePlugin,
    LogLevel,
} from '@azure/msal-node';

import { 
    AppSettings 
} from './Types';

export class ConfigurationUtils {

    /**
     * Validates the fields in the custom JSON configuration file
     * @param {AppSettings} config: configuration file
     */
    static validateAppSettings = (config: AppSettings): void => {

        if (!config.credentials.clientId || config.credentials.clientId === "Enter_the_Application_Id_Here") {
            throw new Error("No clientId provided!");
        }

        if (!config.credentials.tenantId || config.credentials.tenantId === "Enter_the_Tenant_Info_Here") {
            throw new Error("No tenantId provided!"); 
        }

        if (!config.credentials.clientSecret || config.credentials.clientSecret === "Enter_the_Client_Secret_Here") {
            throw new Error("No clientSecret provided!"); 
        }

        if (!config.settings.redirectUri || config.settings.redirectUri === "Enter_the_Redirect_Uri_Here") {
            throw new Error("No postLogoutRedirectUri provided!"); 
        }

        if (!config.settings.postLogoutRedirectUri || config.settings.postLogoutRedirectUri === "Enter_the_Post_Logout_Redirect_Uri_Here") {
            throw new Error("No postLogoutRedirectUri provided!"); 
        }

        if (!config.settings.homePageRoute || config.settings.homePageRoute === "Enter_the_Home_Page_Route_Here") {
            throw new Error("No homePageRoute provided!"); 
        }
    };

    /**
     * Maps the custom JSON configuration file to configuration
     * object expected by MSAL Node ConfidentialClientApplication
     * @param {JSON} config: configuration file
     * @param {Object} cachePlugin: passed during initialization
     */
    static getMsalConfiguration = (config: AppSettings, cachePlugin: ICachePlugin = null): Configuration => {
        return {
            auth: {
                clientId: config.credentials.clientId,
                authority: config.policies ? Object.entries(config.policies)[0][1]['authority'] : `https://${Constants.DEFAULT_AUTHORITY_HOST}/${config.credentials.tenantId}`,
                clientSecret: config.credentials.clientSecret,
                knownAuthorities: config.policies ? [UrlString.getDomainFromUrl(Object.entries(config.policies)[0][1]['authority'])] : [], // in B2C scenarios
            },
            cache: {
                cachePlugin,
            },
            system: {
                loggerOptions: {
                    loggerCallback: (logLevel, message, containsPii) => {
                        console.log(message);
                    },
                    piiLoggingEnabled: false, 
                    logLevel: LogLevel.Verbose,
                }
            }
        }
    };
}