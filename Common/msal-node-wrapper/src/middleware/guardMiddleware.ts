/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Request, Response, NextFunction, RequestHandler } from "express";
import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { RouteGuardOptions } from "./MiddlewareOptions";
import { AccessDeniedError } from "../error/AccessDeniedError";

function guardMiddleware(
    this: WebAppAuthProvider,
    options: RouteGuardOptions
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void | Response => {
        if (!req.authContext.isAuthenticated()) {
            if (options.forceLogin) {
                return req.authContext.login({
                    postLoginRedirectUri: req.originalUrl,
                    scopes: [],
                })(req, res, next);
            }

            return next(AccessDeniedError.createUnauthorizedAccessError(req.originalUrl, req.authContext.getAccount()));
        }

        if (options.idTokenClaims) {
            const tokenClaims = req.authContext.getAccount()?.idTokenClaims || {};
            const requiredClaims = options.idTokenClaims;

            const hasClaims = Object.keys(requiredClaims).every((claim: string) => {
                if (requiredClaims[claim] && tokenClaims[claim]) {
                    switch (typeof requiredClaims[claim]) {
                        case "string" || "number":
                            return requiredClaims[claim] === tokenClaims[claim];

                        case "object":
                            if (Array.isArray(requiredClaims[claim])) {
                                const requiredClaimsArray = requiredClaims[claim] as [];
                                const tokenClaimsArray = tokenClaims[claim] as [];

                                return requiredClaimsArray.some(
                                    (requiredClaim) => tokenClaimsArray.indexOf(requiredClaim) >= 0
                                );
                            }
                            break;

                        default:
                            break;
                    }
                }

                return false;
            });

            if (!hasClaims) {
                return next(AccessDeniedError.createForbiddenAccessError(req.originalUrl, req.authContext.getAccount()));
            }
        }

        next();
    };
}

export default guardMiddleware;
