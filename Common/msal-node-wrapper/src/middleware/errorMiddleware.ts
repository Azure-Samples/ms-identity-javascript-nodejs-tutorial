/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { InteractionRequiredError } from "../error/InteractionRequiredError";

function errorMiddleware(this: WebAppAuthProvider): ErrorRequestHandler {
    return (err: unknown, req: Request, res: Response, next: NextFunction): Response | void => {
        if (err instanceof InteractionRequiredError) {
            return req.authContext.login({
                postLoginRedirectUri: err.requestOptions.postLoginRedirectUri || req.originalUrl,
                ...err.requestOptions
            })(req, res, next);
        }

        next(err);
    };
}

export default errorMiddleware;
