# MSAL Node wrapper for Express.js

This project illustrates a simple wrapper around the [ConfidentialClientApplication](https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html) class of the [Microsoft Authentication Library for Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node#microsoft-authentication-library-for-node-msal-node) (MSAL Node) for web applications built with Express.js, in order to streamline routine authentication tasks, such as login, logout and token acquisition, as well as securing routes and controlling access.

This is an open source project. [Suggestions](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/issues/new) and [contributions](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/blob/main/CONTRIBUTING.md) are welcome!

## Features

* Simple API for authN/authZ with the [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/v2-overview)
* Handle role-based access with Azure AD [App Roles](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) and [Security Groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal)
* Token persistence via sessions.

## Prerequisites

* [Node](https://nodejs.org/en/) v16 LTS or higher
* [Express.js](https://expressjs.com/) 4.x or higher
* [express-session](https://www.npmjs.com/package/express-session)

## Installation

```console
    npm install azure-samples/ms-identity-javascript-nodejs-tutorial 
```

or download and extract the repository *.zip* file.

## Build

```console
    git clone https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial.git
    cd ms-identity-javascript-nodejs-tutorial/Common/msal-node-wrapper
    npm install
    npm run build
```

## Getting started

### Initialization

Import the package and initialize the [WebAppAuthProvider](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/msalwebappauthclient.html). The [initialize()](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/WebAppAuthProvider.html#initialize) method takes a [configuration](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/types/AuthConfig.html) object.

Below is a basic web application using **WebAppAuthProvider**:

```javascript
const express = require('express');
const session = require('express-session');
const { WebAppAuthProvider } = require('msal-node-wrapper');

const SERVER_PORT = process.env.PORT || 4000;

async function main() {

    // initialize express
    const app = express();

    /**
     * Using express-session middleware. Be sure to familiarize yourself with available options
     * and set them as desired. Visit: https://www.npmjs.com/package/express-session
     */
    app.use(session({
        secret: 'ENTER_YOUR_SECRET_HERE',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // set this to true on production
        }
    }));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    try {
        // initialize the wrapper
        const authProvider = await WebAppAuthProvider.initialize({
            auth: {
                authority: "https://login.microsoftonline.com/Enter_the_Tenant_Info_Here",
                clientId: "Enter_the_Application_Id_Here",
                clientSecret: "Enter_the_Client_Secret_Here", // use certificates instead for enhanced security
                redirectUri: "/redirect",
            }
        });
    
        app.use(authProvider.authenticate({
            protectAllRoutes: true, // force user to authenticate for all routes
            acquireTokenForResources: { // acquire an access token for this resource
                "graph.microsoft.com": { // you can specify the resource name as you like
                    scopes: ["User.Read"], // scopes for the resource that you want to acquire a token for
                    routes: ["/profile"] // acquire a token before the user hits these routes
                },
            }
        }));
    
        // add your routers/controllers here...
    
        app.use(authProvider.interactionErrorHandler()); // this middleware handles interaction required errors
    
        app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

main();
```

You can access the current authentication context via `req.authContext` variable:

* `req.authContext.isAuthenticated()`: indicates if the current user is authenticated or not.
* `req.authContext.getAccount()`: MSAL.js account object containing useful information like ID token claims (see [AccountInfo](https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_common.html#accountinfo))
* `req.authContext.getCachedTokenForResource(<resourceName>)`: returns the access token for the given resource from cache, if exists and not expired.

### Middleware

#### Authentication

Add [login()](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/AuthContext.html#login) and [logout()](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/AuthContext.html#logout) middleware to routes that you want to trigger a login/logout with Azure AD:

```javascript
app.get(
    '/signin',
    (req, res, next) => {
        return req.authContext.login({
            postLoginRedirectUri: "/",
        })(req, res, next);
    }
);
```

```javascript
app.get(
    '/signout',
    (req, res, next) => {
        return req.authContext.logout({
            postLogoutRedirectUri: "/",
        })(req, res, next);
    }
);
```

Alternatively, you can require authentication for all routes in your application using the [authenticate()](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/WebAppAuthProvider.html#authenticate) middleware:

```javascript
    app.use(authProvider.authenticate({
        protectAllRoutes: true,
    }));
```

#### Acquiring tokens

[acquireToken()](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/AuthContext.html#acquireToken) can be used in controllers to acquire a token silently from cache or network using the refresh token. If this is not possible, acquireToken will throw an **interaction required** error. To handle this error, make sure you have added the [interactionErrorHandler](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/WebAppAuthProvider.html#interactionErrorHandler) to the end of your middleware chain.

If you have configured the [authenticate()](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/WebAppAuthProvider.html#authenticate) middleware before, you can also use the [getCachedTokenForResource()](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/AuthContext.html#getCachedTokenForResource) method to retrieve a non-expired access token for the resource from cache directly.

```javascript
exports.getProfilePage = async (req, res, next) => {
    try {
        /**
         * If you have configured your authenticate middleware accordingly, you should be 
         * able to get the access token for the Microsoft Graph API from the cache. If not, 
         * you will need to acquire and cache the token yourself.
         */
        let accessToken = req.authContext.getCachedTokenForResource("graph.microsoft.com");

        if (!accessToken) {

            /**
             * You can acquire a token for the Microsoft Graph API as shown below. Note that
             * if an interaction required error is thrown, you need to catch it and pass it 
             * to the interactionErrorHandler middleware.
             */
            const tokenResponse = await req.authContext.acquireToken({
                scopes: ["User.Read"],
                account: req.authContext.getAccount(),
            })(req, res, next);

            accessToken = tokenResponse.accessToken;
        }

        // ...

    } catch (error) {
        next(error); // pass errors to error middleware for handling
    }
}
```

#### Securing routes

Simply add the [guard()](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/WebAppAuthProvider.html#guard) middleware before the controller that serves the page you would like to secure:

```javascript
    app.get('/id',
        authProvider.guard({
            forceLogin: true // ensure that the user is authenticated before accessing this route
        }),
        (req, res, next) => {
            res.render('id', {
                isAuthenticated: req.authContext.isAuthenticated(), 
                idToken: req.authContext.getAccount().idTokenClaims
            });
        }
    );
```

#### Controlling access

Use the [guard()](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/WebAppAuthProvider.html#guard) middleware to control access for a certain claim or claims in the user's ID token:

```javascript
    app.get(
        '/todolist',
        authProvider.guard({
            forceLogin: true, // ensure that the user is authenticated before accessing this route
            idTokenClaims: {
                roles: ["TaskUser", "TaskAdmin"], // grant access to the route only if user has one of these claims
            },
        }),
    );

    app.get(
        '/dashboard',
        authProvider.guard({
            forceLogin: false, // if user is not authenticated, an error will be thrown instead
            idTokenClaims: {
                roles: ["TaskAdmin"],
            },
        })
    );
```

## Remarks

### Session support

We recommend using [express-session](https://www.npmjs.com/package/express-session) to add session support to your apps. package using in-memory session store. **in-memory session store** is unfit for production, and you should either use a [compatible session store](https://github.com/expressjs/session#compatible-session-stores) or implement your own storage solution.

### Caching

MSAL Node has an in-memory cache by default. This wrapper adds support for storing MSAL cache in user session. As such, a session middleware is necessary for enabling cache persistence.

## Information

* [Initializing a confidential client app with MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md)
* [MSAL Node Configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md)
