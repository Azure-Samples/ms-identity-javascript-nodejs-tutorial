/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Logger } from "@azure/msal-common";
import { ConfidentialClientApplication, Configuration, CryptoProvider } from "@azure/msal-node";
import { AuthConfig } from "../config/ConfigurationTypes";
import { DEFAULT_LOGGER_OPTIONS } from "../utils/Constants";
import { packageName, packageVersion } from "../packageMetadata";

export abstract class BaseAuthProvider {
    protected authConfig: AuthConfig;
    protected msalConfig: Configuration;
    protected cryptoProvider: CryptoProvider;
    protected logger: Logger;

    protected constructor(authConfig: AuthConfig, msalConfig: Configuration) {
        this.authConfig = authConfig;
        this.msalConfig = msalConfig;
        this.cryptoProvider = new CryptoProvider();
        this.logger = new Logger(
            this.msalConfig.system?.loggerOptions || DEFAULT_LOGGER_OPTIONS,
            packageName,
            packageVersion
        );
    }

    getAuthConfig(): AuthConfig {
        return this.authConfig;
    }

    getMsalConfig(): Configuration {
        return this.msalConfig;
    }

    getCryptoProvider(): CryptoProvider {
        return this.cryptoProvider;
    }

    getLogger(): Logger {
        return this.logger;
    }

    getMsalClient(): ConfidentialClientApplication {
        return new ConfidentialClientApplication(this.msalConfig);
    }
}
