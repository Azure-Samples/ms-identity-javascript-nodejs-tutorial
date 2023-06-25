/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { UrlUtils } from "../../src/utils/UrlUtils";

describe("Url utilities tests", () => {
    it("should ensure a given url is absolute", () => {
        const absoluteUrl = "https://www.microsoft.com/myPath";

        const url1 = "/myPath";
        const url2 = "myPath";
        const url3 = "www.microsoft.com/myPath";
        const protocol = "https";
        const host = "www.microsoft.com";

        expect(UrlUtils.ensureAbsoluteUrl(url1, protocol, host)).toBe(absoluteUrl);
        expect(UrlUtils.ensureAbsoluteUrl(url2, protocol, host)).toBe(absoluteUrl);
        expect(UrlUtils.ensureAbsoluteUrl(url3, protocol, host)).toBe(absoluteUrl);
    });

    it("should get path component from a given url", () => {
        const url1 = "https://localhost:8080/path/to/resource";
        const url2 = "https://localhost:8080/path/to/resource?query=value";
        const url3 = "https://localhost:8080/path/to/resource#fragment";
        const url4 = "https://localhost:8080/path/to/resource?query=value#fragment";
        const url5 = "/path/to/resource";

        expect(UrlUtils.getPathFromUrl(url1)).toEqual("/path/to/resource");
        expect(UrlUtils.getPathFromUrl(url2)).toEqual("/path/to/resource");
        expect(UrlUtils.getPathFromUrl(url3)).toEqual("/path/to/resource");
        expect(UrlUtils.getPathFromUrl(url4)).toEqual("/path/to/resource");
        expect(UrlUtils.getPathFromUrl(url5)).toEqual("/path/to/resource");
    });
});
