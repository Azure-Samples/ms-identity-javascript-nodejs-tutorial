import { AccountInfo } from "@azure/msal-common";
export declare type AuthCodeParams = {
    authority: string;
    scopes: string[];
    state: string;
    redirect: string;
    prompt?: string;
    account?: AccountInfo;
};
export declare type ValidationOptions = {
    audience: string;
    issuer: string;
    scope: string;
};
export declare type State = {
    nonce: string;
    stage: string;
};
export declare type Resource = {
    callingPageRoute: string;
    endpoint: string;
    scopes: string[];
};
export declare type Credentials = {
    clientId: string;
    tenantId: string;
    clientSecret: string;
    clientCertificate: ClientCertificate;
};
export declare type ClientCertificate = {
    thumbprint: string;
    privateKey: string;
};
export declare type Settings = {
    homePageRoute: string;
    redirectUri: string;
    postLogoutRedirectUri: string;
};
export declare type AppSettings = {
    credentials: Credentials;
    settings: Settings;
    resources: {
        [resource: string]: Resource;
    };
    policies: {
        [policy: string]: Policy;
    };
    protected: any;
};
export declare type Policy = {
    authority: string;
};
export declare type UserInfo = {
    businessPhones?: Array<string>;
    displayName?: string;
    givenName?: string;
    id?: string;
    jobTitle?: string;
    mail?: string;
    mobilePhone?: string;
    officeLocation?: string;
    preferredLanguage?: string;
    surname?: string;
    userPrincipalName?: string;
};
