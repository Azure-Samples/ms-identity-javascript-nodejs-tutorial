/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IUri, UrlString } from "@azure/msal-common";
import { Request } from "express";

export class UrlUtils {
    /**
     * Returns the absolute URL from a given request and path string
     * @param {string} url: a given URL
     * @param {string} protocol: protocol of the request
     * @param {string} host: host of the request
     * @returns {string}
     */
    static ensureAbsoluteUrl = (url: string, protocol: string, host: string): string => {
        const urlComponents: IUri = new UrlString(url).getUrlComponents();

        if (!urlComponents.Protocol) {
            if (!urlComponents.HostNameAndPort && !url.startsWith("www")) {
                if (!url.startsWith("/")) {
                    return protocol + "://" + host + "/" + url;
                }
                return protocol + "://" + host + url;
            }
            return protocol + "://" + url;
        } else {
            return url;
        }
    };

    /**
     * Given a URL string, ensures that it is an absolute URL
     * @param {Request} req: Express request object
     * @param {string} url: a given URL 
     * @returns {string}
     */
    static ensureAbsoluteUrlFromRequest = (req: Request, url?: string): string => {
        if (url) {
            return UrlUtils.ensureAbsoluteUrl(url, req.protocol, req.get("host") || req.hostname);
        } else {
            return UrlUtils.ensureAbsoluteUrl(req.originalUrl, req.protocol, req.get("host") || req.hostname);
        }
    };

    /**
     * Checks if the URL from a given request matches a given URL
     * @param {Request} req: Express request object
     * @param {string} url: a given URL 
     * @returns {boolean}
     */
    static checkIfRequestsMatch = (req: Request, url: string): boolean => {
        return UrlUtils.ensureAbsoluteUrlFromRequest(req) === UrlUtils.ensureAbsoluteUrlFromRequest(req, url);
    };

    /**
     * Returns the path segment from a given URL
     * @param {string} url: a given URL
     * @returns {string}
     */
    static getPathFromUrl = (url: string): string => {
        const urlComponents: IUri = new UrlString(url).getUrlComponents();
        return `/${urlComponents.PathSegments.join("/")}`;
    };

    /**
     * Ensures that the path contains a leading slash at the start
     * @param {string} path: a given path
     * @returns {string}
     */
    static enforceLeadingSlash = (path: string): string => {
        return path.split("")[0] === "/" ? path : "/" + path;
    };

    /**
     * Ensures that the URL contains a trailing slash at the end
     * @param {string} url: a given path
     * @returns {string}
     */
    static enforceTrailingSlash = (url: string): string => {
        return url.endsWith("/") ? url : url + "/";
    };
}
