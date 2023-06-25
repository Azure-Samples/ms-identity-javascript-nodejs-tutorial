import { Logger } from "@azure/msal-common";
import { ConfidentialClientApplication, Configuration, CryptoProvider } from "@azure/msal-node";
import { AuthConfig } from "../config/ConfigurationTypes";
export declare abstract class BaseAuthProvider {
    protected authConfig: AuthConfig;
    protected msalConfig: Configuration;
    protected cryptoProvider: CryptoProvider;
    protected logger: Logger;
    protected constructor(authConfig: AuthConfig, msalConfig: Configuration);
    getAuthConfig(): AuthConfig;
    getMsalConfig(): Configuration;
    getCryptoProvider(): CryptoProvider;
    getLogger(): Logger;
    getMsalClient(): ConfidentialClientApplication;
}
//# sourceMappingURL=BaseAuthProvider.d.ts.map