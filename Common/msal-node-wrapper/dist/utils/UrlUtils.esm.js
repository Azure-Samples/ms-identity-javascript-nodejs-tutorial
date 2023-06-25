/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
import { UrlString } from '../node_modules/@azure/msal-common/dist/url/UrlString.esm.js';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class UrlUtils {
}
/**
 * Returns the absolute URL from a given request and path string
 * @param {string} url: a given URL
 * @param {string} protocol: protocol of the request
 * @param {string} host: host of the request
 * @returns {string}
 */
UrlUtils.ensureAbsoluteUrl = (url, protocol, host) => {
    const urlComponents = new UrlString(url).getUrlComponents();
    if (!urlComponents.Protocol) {
        if (!urlComponents.HostNameAndPort && !url.startsWith("www")) {
            if (!url.startsWith("/")) {
                return protocol + "://" + host + "/" + url;
            }
            return protocol + "://" + host + url;
        }
        return protocol + "://" + url;
    }
    else {
        return url;
    }
};
/**
 * Given a URL string, ensures that it is an absolute URL
 * @param {Request} req: Express request object
 * @param {string} url: a given URL
 * @returns {string}
 */
UrlUtils.ensureAbsoluteUrlFromRequest = (req, url) => {
    if (url) {
        return UrlUtils.ensureAbsoluteUrl(url, req.protocol, req.get("host") || req.hostname);
    }
    else {
        return UrlUtils.ensureAbsoluteUrl(req.originalUrl, req.protocol, req.get("host") || req.hostname);
    }
};
/**
 * Checks if the URL from a given request matches a given URL
 * @param {Request} req: Express request object
 * @param {string} url: a given URL
 * @returns {boolean}
 */
UrlUtils.checkIfRequestsMatch = (req, url) => {
    return UrlUtils.ensureAbsoluteUrlFromRequest(req) === UrlUtils.ensureAbsoluteUrlFromRequest(req, url);
};
/**
 * Returns the path segment from a given URL
 * @param {string} url: a given URL
 * @returns {string}
 */
UrlUtils.getPathFromUrl = (url) => {
    const urlComponents = new UrlString(url).getUrlComponents();
    return `/${urlComponents.PathSegments.join("/")}`;
};
/**
 * Ensures that the path contains a leading slash at the start
 * @param {string} path: a given path
 * @returns {string}
 */
UrlUtils.enforceLeadingSlash = (path) => {
    return path.split("")[0] === "/" ? path : "/" + path;
};
/**
 * Ensures that the URL contains a trailing slash at the end
 * @param {string} url: a given path
 * @returns {string}
 */
UrlUtils.enforceTrailingSlash = (url) => {
    return url.endsWith("/") ? url : url + "/";
};

export { UrlUtils };
//# sourceMappingURL=UrlUtils.esm.js.map
