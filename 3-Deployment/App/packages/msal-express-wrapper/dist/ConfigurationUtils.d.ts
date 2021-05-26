import { Configuration, ICachePlugin } from '@azure/msal-node';
import { AppSettings } from './Types';
export declare class ConfigurationUtils {
    /**
     * Validates the fields in the custom JSON configuration file
     * @param {AppSettings} config: configuration file
     */
    static validateAppSettings: (config: AppSettings) => void;
    /**
     * Maps the custom JSON configuration file to configuration
     * object expected by MSAL Node ConfidentialClientApplication
     * @param {JSON} config: configuration file
     * @param {Object} cachePlugin: passed during initialization
     */
    static getMsalConfiguration: (config: AppSettings, cachePlugin?: ICachePlugin) => Configuration;
}
