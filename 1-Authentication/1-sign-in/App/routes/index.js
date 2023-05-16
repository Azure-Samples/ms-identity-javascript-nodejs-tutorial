/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
    const isAuthenticated = req.session.isAuthenticated;
    const username = req.session.account ? req.session.account.username : '';
    res.render("home", { isAuthenticated: isAuthenticated, username: username });
});

module.exports = router;
