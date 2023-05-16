/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require("express");
const session = require("express-session");
const path = require("path");

const { WebAppAuthProvider } = require("../dist/index");
const appSettings = require("./appSettings");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const SERVER_PORT = process.env.PORT || 4000;

// initialize express
const app = express();

/**
 * Using express-session middleware. Be sure to familiarize yourself with available options
 * and set them as desired. Visit: https://www.npmjs.com/package/express-session
 */
app.use(
    session({
        secret: "ENTER_YOUR_SECRET_HERE",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // set this to true on production
        },
    })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

app.use(express.static(path.join(__dirname, "./public")));

async function main() {
    // instantiate the wrapper
    const msid = await WebAppAuthProvider.initialize(appSettings);
    app.use(msid.authenticate({
        protectAllRoutes: false,
    }));

    app.use("/", indexRouter);
    app.use("/user", userRouter);
    app.use("/auth", authRouter);
    
    app.use(msid.interactionErrorHandler());
}

main();

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));

module.exports = app;
