/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
'use strict';

var InteractionRequiredError = require('../error/InteractionRequiredError.js');

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function errorMiddleware() {
    return (err, req, res, next) => {
        if (err instanceof InteractionRequiredError.InteractionRequiredError) {
            return req.authContext.login({
                postLoginRedirectUri: err.requestOptions.postLoginRedirectUri || req.originalUrl,
                ...err.requestOptions
            })(req, res, next);
        }
        next(err);
    };
}

module.exports = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map
