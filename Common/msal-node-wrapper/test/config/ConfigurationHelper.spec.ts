/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ConfigurationHelper } from "../../src/config/ConfigurationHelper";
import { TEST_AUTH_CONFING, TEST_MSAL_CONFIG } from "../TestConstants";

describe("MSAL configuration builder tests", () => {
    it("should instantiate a valid msal configuration object", () => {
        const msalConfig = ConfigurationHelper.getMsalConfiguration(TEST_AUTH_CONFING);

        expect(msalConfig).toBeDefined();

        expect(msalConfig).toMatchObject(TEST_MSAL_CONFIG);
    });
});

describe("Configuration helper tests", () => {

    it("should detect a GUID", () => {
        const guid1 = "0D4C9F3E-A8C5-4D4C-B8B0-C8E8E8E8E8E8";
        const guid2 = "81b8a568-2442-4d53-8d6c-ededab4b7c62";
        const guid3 = "81b8a56824424d538d6cededab4b7c62";
        const guid4 = "Very pleasant pineapple";
        const guid5 = "";

        expect(ConfigurationHelper.isGuid(guid1)).toBe(true);
        expect(ConfigurationHelper.isGuid(guid2)).toBe(true);
        expect(ConfigurationHelper.isGuid(guid3)).toBe(false);
        expect(ConfigurationHelper.isGuid(guid4)).toBe(false);
        expect(ConfigurationHelper.isGuid(guid5)).toBe(false);
    });

    it("should get effective scopes from a given list of scopes", () => {
        const scopes = "email openid profile offline_access User.Read calendars.read".split(" ");
        const effectiveScopes = ConfigurationHelper.getEffectiveScopes(scopes);
        expect(effectiveScopes).toEqual(["User.Read", "calendars.read"]);
        expect(["User.Read", "calendars.read"].every(elem => effectiveScopes.includes(elem))).toBe(true);
    });

    it("should return instance from a given authority", () => {
        expect(ConfigurationHelper.getInstanceFromAuthority("https://login.microsoftonline.com/81b8a56824424d538d6cededab4b7c62"))
            .toBe("login.microsoftonline.com");

        expect(ConfigurationHelper.getInstanceFromAuthority("https://login.microsoftonline.com/81b8a56824424d538d6cededab4b7c62/"))
            .toBe("login.microsoftonline.com");
    });

    it("should return tenantId from a given authority", () => {
        expect(ConfigurationHelper.getTenantIdFromAuthority("https://login.microsoftonline.com/81b8a56824424d538d6cededab4b7c62"))
            .toBe("81b8a56824424d538d6cededab4b7c62");

        expect(ConfigurationHelper.getTenantIdFromAuthority("https://login.microsoftonline.com/81b8a56824424d538d6cededab4b7c62/"))
            .toBe("81b8a56824424d538d6cededab4b7c62");

        expect(ConfigurationHelper.getTenantIdFromAuthority("https://login.microsoftonline.com/mytenant.onmicrosoft.com"))
            .toBe("mytenant.onmicrosoft.com");
    });

});
