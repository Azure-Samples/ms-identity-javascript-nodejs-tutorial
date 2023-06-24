# msal-node-wrapper

This project illustrates a simple wrapper around the [ConfidentialClientApplication](https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html) class of the [Microsoft Authentication Library for Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node#microsoft-authentication-library-for-node-msal-node) (MSAL Node), in order to streamline routine authentication tasks, such as login, logout and token acquisition, as well as securing routes and controlling access. This can be used in web apps built with Express.js, or frameworks that are based on Express.js.

This is an open source project. [Suggestions](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/issues/new) and [contributions](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial/blob/main/CONTRIBUTING.md) are welcome!

## Features

* Simple API for authN/authZ with the [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/v2-overview)
* Handle role-based access with Azure AD [App Roles](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) and [Security Groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal)
* Token persistence via sessions.

## Prerequisites

* [Node](https://nodejs.org/en/) 16 LTS or higher
* [Express.js](https://expressjs.com/) 4.x or higher
* [@azure/msal-node](https://www.npmjs.com/package/@azure/msal-node)
* [express-session](https://www.npmjs.com/package/express-session) (or a similar session solution)

## Installation

```console
    npm install azure-samples/ms-identity-javascript-nodejs-tutorial 
```

or download and extract the repository *.zip* file.

## Build

```console
    git clone https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial.git
    cd ms-identity-javascript-nodejs-tutorial/shared/msal-node-wrapper
    npm install
    npm run build
```

## Getting started

### Configuration

1. Initialize the wrapper by providing a configuration object. The object looks like the follows:

```javascript
const authConfig = {
    authOptions: {
        authority: "https://login.microsoftonline.com/Enter_the_Tenant_Info_Here",
        clientId: "Enter_the_Application_Id_Here",
        clientSecret: "Enter_the_Client_Secret_Here",
        redirectUri: "/redirect",
    }
};

// initialize the wrapper
const authProvider = await WebAppAuthProvider.initialize(authConfig);
```

### Integration with Express.js

Import the package and instantiate [MsalWebAppAuthClient](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/msalwebappauthclient.html) class, via the *WebAppAuthClientBuilder*, which exposes the middleware you can use in your routes. The constructor takes the settings object and an (optional) persistent cache:

```javascript
const express = require('express');
const session = require('express-session');
const { WebAppAuthProvider } = require('msal-node-wrapper');

const authConfig = require('./authConfig.js');
const mainRouter = require('./routes/mainRoutes');

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

    // initialize the wrapper
    const authProvider = await WebAppAuthProvider.initialize(authConfig);

    app.use(authProvider.authenticate({
        protectAllRoutes: true,
        acquireTokenForResources: {
            "graph.microsoft.com": {
                scopes: ["User.Read"],
                routes: ["/profile"]
            },
        }
    }));

    // pass the instance to your routers
    app.use(mainRouter);

    app.use(authProvider.interactionErrorHandler());

    app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
}

main();
```

You can access the current authentication context via `req.authContext` variable:

* `req.authContext.isAuthenticated()`: indicates if the current user is authenticated or not.
* `req.authContext.getAccount()`: MSAL.js account object containing useful information like ID token claims (see [AccountInfo](https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_common.html#accountinfo))
* `req.authContext.getCachedTokenForResource(resourceName)`: returns the raw access token for the given resource from cache, if exists and still valid.

### Middleware

#### Authentication

Add [login()]() and [logout()]() middleware to routes that you want to trigger a login/logout:

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

Alternatively, you can require authentication for all routes in your application using the authenticate() middleware:

```javascript
    app.use(authProvider.authenticate({
        protectAllRoutes: true,
    }));
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

#### Securing routes

Simply add the [isAuthenticated()](https://azure-samples.github.io/ms-identity-javascript-nodejs-tutorial/classes/msalwebappauthclient.html#isauthenticated) middleware before the controller that serves the page you would like to secure:

```javascript
    app.get('/id',
        authProvider.guard({
            forceLogin: true
        }),
        (req, res, next) => {
            res.render('id', {
                isAuthenticated: req.authContext.isAuthenticated(), 
                idToken: req.authContext.getAccount().idTokenClaims
            });
        }
    );
```

#### Acquiring tokens

[acquireToken()]() can be used before middleware that calls a web API. The access token will be available via 

```javascript
    router.get('/profile',
        msid.isAuthenticated(),
        msid.getToken({
            resource: {
                endpoint: "https://graph.microsoft.com/v1.0/me",
                scopes: [ "User.Read" ]
            }
        }),
        async(req, res, next) => {        
            try {
                // use axios or a similar alternative
                const response = await axios.default.get("https://graph.microsoft.com/v1.0/me", {
                    headers: {
                        Authorization: `Bearer ${req.session["graphAPI"].accessToken}`
                    }
                });

                res.render('profile', { isAuthenticated: req.session.isAuthenticated, profile: response.data });
            } catch (error) {
                console.log(error);
                next(error);
            }
        }
    ); // get token for this route to call web API
```

#### Controlling access

Use [guard()]() middleware to control access for Azure AD App Roles and/or Security Groups:

```javascript
    app.get(
        '/todolist',
        authProvider.guard({
            forceLogin: true,
            idTokenClaims: {
                roles: ["TaskUser", "TaskAdmin"],
            },
        }),
    );

    app.get(
        '/dashboard',
        authProvider.guard({
            forceLogin: true,
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

MSAL Node has an in-memory cache by default. This wrapper adds support for storing msal cache in user session. As such, a session middleware is necessary for enabling cache persistence.

## Information

* [Initializing a confidential client app with MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md)
* [MSAL Node Configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md)
