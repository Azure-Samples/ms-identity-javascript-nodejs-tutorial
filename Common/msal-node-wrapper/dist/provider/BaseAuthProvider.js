/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
'use strict';

var msalNode = require('@azure/msal-node');
var Constants = require('../utils/Constants.js');
var packageMetadata = require('../packageMetadata.js');
var Logger = require('../node_modules/@azure/msal-common/dist/logger/Logger.js');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class BaseAuthProvider {
    constructor(authConfig, msalConfig) {
        this.authConfig = authConfig;
        this.msalConfig = msalConfig;
        this.cryptoProvider = new msalNode.CryptoProvider();
        this.logger = new Logger.Logger(this.msalConfig.system?.loggerOptions || Constants.DEFAULT_LOGGER_OPTIONS, packageMetadata.packageName, packageMetadata.packageVersion);
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
        return new msalNode.ConfidentialClientApplication(this.msalConfig);
    }
}

exports.BaseAuthProvider = BaseAuthProvider;
//# sourceMappingURL=BaseAuthProvider.js.map
