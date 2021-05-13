/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { AccountInfo } from "@azure/msal-common"

export type AuthCodeParams = {
    authority: string,
    scopes: string[],
    state: string,
    redirect: string,
    prompt?: string,
    account?: AccountInfo
}

export type ValidationOptions = {
    audience: string,
    issuer: string,
    scope: string,
}

export type State = {
    nonce: string,
    stage: string
}

export type Resource = {
    callingPageRoute: string,
    endpoint: string,
    scopes: string[]
}

export type Credentials = {
    clientId: string,
    tenantId: string,
    clientSecret: string,
    clientCertificate: ClientCertificate,
}

export type ClientCertificate = {
    thumbprint: string,
    privateKey: string,
}

export type Settings = {
    homePageRoute: string,
    redirectUri: string,
    postLogoutRedirectUri: string
}

export type AppSettings = {
    credentials: Credentials,
    settings: Settings,
    resources: {
        [resource: string]: Resource
    },
    policies: {
        [policy: string]: Policy,
    },
    protected: any,
}

export type Policy = {
    authority: string
}

export type UserInfo = {
    businessPhones?: Array<string>,
    displayName?: string,
    givenName?: string,
    id?: string,
    jobTitle?: string,
    mail?: string,
    mobilePhone?: string,
    officeLocation?: string,
    preferredLanguage?: string,
    surname?: string,
    userPrincipalName?: string
};