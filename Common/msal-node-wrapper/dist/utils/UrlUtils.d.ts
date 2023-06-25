import { Request } from "express";
export declare class UrlUtils {
    /**
     * Returns the absolute URL from a given request and path string
     * @param {string} url: a given URL
     * @param {string} protocol: protocol of the request
     * @param {string} host: host of the request
     * @returns {string}
     */
    static ensureAbsoluteUrl: (url: string, protocol: string, host: string) => string;
    /**
     * Given a URL string, ensures that it is an absolute URL
     * @param {Request} req: Express request object
     * @param {string} url: a given URL
     * @returns {string}
     */
    static ensureAbsoluteUrlFromRequest: (req: Request, url?: string) => string;
    /**
     * Checks if the URL from a given request matches a given URL
     * @param {Request} req: Express request object
     * @param {string} url: a given URL
     * @returns {boolean}
     */
    static checkIfRequestsMatch: (req: Request, url: string) => boolean;
    /**
     * Returns the path segment from a given URL
     * @param {string} url: a given URL
     * @returns {string}
     */
    static getPathFromUrl: (url: string) => string;
    /**
     * Ensures that the path contains a leading slash at the start
     * @param {string} path: a given path
     * @returns {string}
     */
    static enforceLeadingSlash: (path: string) => string;
    /**
     * Ensures that the URL contains a trailing slash at the end
     * @param {string} url: a given path
     * @returns {string}
     */
    static enforceTrailingSlash: (url: string) => string;
}
//# sourceMappingURL=UrlUtils.d.ts.map