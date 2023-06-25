/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
import { CryptoProvider, ConfidentialClientApplication } from '@azure/msal-node';
import { DEFAULT_LOGGER_OPTIONS } from '../utils/Constants.esm.js';
import { packageName, packageVersion } from '../packageMetadata.esm.js';
import { Logger } from '../node_modules/@azure/msal-common/dist/logger/Logger.esm.js';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class BaseAuthProvider {
    constructor(authConfig, msalConfig) {
        this.authConfig = authConfig;
        this.msalConfig = msalConfig;
        this.cryptoProvider = new CryptoProvider();
        this.logger = new Logger(this.msalConfig.system?.loggerOptions || DEFAULT_LOGGER_OPTIONS, packageName, packageVersion);
    }
    getAuthConfig() {
        return this.authConfig;
    }
    getMsalConfig() {
        return this.msalConfig;
    }
    getCryptoProvider() {
        return this.cryptoProvider;
    }
    getLogger() {
        return this.logger;
    }
    getMsalClient() {
        return new ConfidentialClientApplication(this.msalConfig);
    }
}

export { BaseAuthProvider };
//# sourceMappingURL=BaseAuthProvider.esm.js.map
