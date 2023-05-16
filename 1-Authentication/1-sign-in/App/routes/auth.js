
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require("express");
const router = express.Router();

router.get("/signin", (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/",
        postFailureRedirectUri: "/signin",
    })(req, res, next);
});

router.get("/signout", (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/",
    })(req, res, next);
});

module.exports = router;
