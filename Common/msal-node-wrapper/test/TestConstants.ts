/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export const TEST_CONSTANTS = {
    CLIENT_ID: "81b8a568-2442-4d53-8d6c-ededab4b7c62",
    TENANT_ID: "c56a4180-65aa-42ec-a945-5fd21dec0538",
    DEFAULT_AUTHORITY: "https://login.microsoftonline.com/common/",
    AUTHORITY: "https://login.microsoftonline.com/TenantId",
    DEFAULT_AUTHORITY_HOST: "login.microsoftonline.com",
    ALTERNATE_AUTHORITY: "https://login.microsoftonline.com/alternate",
    REDIRECT_URI: "http://localhost:8080",
    CLIENT_SECRET: "MOCK_CLIENT_SECRET",
    DEFAULT_GRAPH_SCOPE: ["user.read"],
    AUTHORIZATION_CODE:
        "0.ASgAqPq4kJXMDkamGO53C-4XWVm3ypmrKgtCkdhePY1PBjsoAJg.AQABAAIAAAAm-06blBE1TpVMil8KPQ41DOje1jDj1oK3KxTXGKg89VjLYJi71gx_npOoxVfC7X49MqOX7IltTJOilUId-IAHndHXlfWzoSGq3GUmwAOLMisftceBRtq3YBsvHX7giiuSZXJgpgu03uf3V2h5Z3GJNpnSXT1f7iVFuRvGh1-jqjWxKs2un8AS5rhti1ym1zxkeicKT43va5jQeHVUlTQo69llnwQJ3iKmKLDVq_Q25Au4EQjYaeEx6TP5IZSqPPm7x0bynmjE8cqR5r4ySP4wH8fjnxlLySrUEZObk2VgREB1AdH6-xKIa04EnJEj9dUgTwiFvQumkuHHetFOgH7ep_9diFOdAOQLUK8C9N4Prlj0JiOcgn6l0xYd5Q9691Ylw8UfifLwq_B7f30mMLN64_XgoBY9K9CR1L4EC1kPPwIhVv3m6xmbhXZ3efx-A-bbV2SYcO4D4ZlnQztHzie_GUlredtsdEMAOE3-jaMJs7i2yYMuIEEtRcHIjV_WscVooCDdKmVncHOObWhNUSdULAejBr3pFs0v3QO_xZ269eLu5Z0qHzCZ_EPg2aL-ERz-rpgdclQ_H_KnEtMsC4F1RgAnDjVmSRKJZZdnNLfKSX_Wd40t_nuo4kjN2cSt8QzzeL533zIZ4CxthOsC4HH2RcUZDIgHdLDLT2ukg-Osc6J9URpZP-IUpdjXg_uwbkHEjrXDMBMo2pmCqaWbMJKo5Lr7CrystifnDITXzZmmOah8HV83Xyb6EP8Gno6JRuaG80j8BKDWyb1Yof4rnLI1kZ59n_t2d0LnRBXz50PdWCWX6vtkg-kAV-bGJQr45XDSKBSv0Q_fVsdLMk24NacUZcF5ujUtqv__Bv-wATzCHWlbUDGHC8nHEi84PcYAjSsgAA",
    ACCESS_TOKEN: "ThisIsAnAccessT0ken",
    REFRESH_TOKEN: "thisIsARefreshT0ken",
    AUTH_CODE_URL:
        "https://login.microsoftonline.com/TenantId/oauth2.0/v2.0/authorize?client_id=b41a6fbb-c728-4e03-aa59-d25b0fd383b6&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%2F8080%2F&response_mode=query&scope=user.read%20openid%20profile%20offline_access",
    CACHE_LOCATION: "Test",
    APP_ROUTE: "/somePath",
    CLIENT_ASSERTION: "MOCK_CLIENT_ASSERTION",
    THUMBPRINT: "6182de7d4b84517655fe0bfa97076890d66bf37a",
    PRIVATE_KEY: "PRIVATE_KEY",
    PUBLIC_CERTIFICATE: `-----BEGIN CERTIFICATE-----
        line1
        line2
        -----END CERTIFICATE-----

        -----BEGIN CERTIFICATE-----
        line3
        line4
        -----END CERTIFICATE-----
            `,
    ACCESS_TOKEN_CLAIMS: {
        aud: "6e74172b-be56-4843-9ff4-e66a39bb12e3",
        iss: "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/v2.0",
        iat: 1537231048,
        nbf: 1537231048,
        exp: 1537234948,
        aio: "AXQAi/8IAAAAtAaZLo3ChMif6KOnttRB7eBq4/DccQzjcJGxPYy/C3jDaNGxXd6wNIIVGRghNRnwJ1lOcAnNZcjvkoyrFxCttv33140RioOFJ4bCCGVuoCag1uOTT22222gHwLPYQ/uf79QX+0KIijdrmp69RctzmQ==",
        azp: "6e74172b-be56-4843-9ff4-e66a39bb12e3",
        azpacr: "0",
        name: "Abe Lincoln",
        oid: "690222be-ff1a-4d56-abd1-7e4f7d38e474",
        preferred_username: "abeli@microsoft.com",
        rh: "I",
        scp: "access_as_user",
        sub: "HKZpfaHyWadeOouYlitjrI-KffTm222X5rrV3xDqfKQ",
        tid: "72f988bf-86f1-41af-91ab-2d7cd011db47",
        uti: "fqiBqXLPj0eQa82S-IYFAA",
        ver: "2.0",
    },
    ID_TOKEN_HEADER: {
        typ: "JWT",
        alg: "RS256",
        kid: "1LTMzakihiRla_8z2BEJVXeWMqo",
    },
    ID_TOKEN_CLAIMS: {
        ver: "2.0",
        iss: "https://login.microsoftonline.com/9122040d-6c67-4c5b-b112-36a304b66dad/v2.0",
        sub: "AAAAAAAAAAAAAAAAAAAAAIkzqFVrSaSaFHy782bbtaQ",
        aud: "6cb04018-a3f5-46a7-b995-940c78f5aef3",
        exp: 1536361411,
        iat: 1536274711,
        nbf: 1536274711,
        name: "Abe Lincoln",
        preferred_username: "AbeLi@microsoft.com",
        oid: "00000000-0000-0000-66f3-3332eca7ea81",
        tid: "9122040d-6c67-4c5b-b112-36a304b66dad",
        nonce: "123523",
        aio: "Df2UVXL1ix!lMCWMSOJBcFatzcGfvFGhjKv8q5g0x732dR5MB5BisvGQO7YWByjd8iQDLq!eGbIDakyp5mnOrcdqHeYSnltepQmRp6AIZ8jY",
    },
    AUTHORITY_METADAT: "mock authority metadata",
    CLOUD_DISCOVERY_METADATA: "mock discovery metadata",
};

export const TEST_AUTH_CONFING = {
    auth: {
        authority: TEST_CONSTANTS.AUTHORITY,
        clientId: TEST_CONSTANTS.CLIENT_ID,
        clientSecret: TEST_CONSTANTS.CLIENT_SECRET,
        authorityMetadata: TEST_CONSTANTS.AUTHORITY_METADAT,
        cloudDiscoveryMetadata: TEST_CONSTANTS.CLOUD_DISCOVERY_METADATA,
        redirectUri: "/redirect",
    },
};

export const TEST_MSAL_CONFIG = {
    auth: {
        clientId: TEST_AUTH_CONFING.auth.clientId,
        authority: TEST_CONSTANTS.AUTHORITY,
        clientSecret: TEST_AUTH_CONFING.auth.clientSecret,
        authorityMetadata: TEST_AUTH_CONFING.auth.authorityMetadata,
        cloudDiscoveryMetadata: TEST_AUTH_CONFING.auth.cloudDiscoveryMetadata,
    },
};
