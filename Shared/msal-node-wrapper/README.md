# microsoft-identity-express (beta)

[![Build](https://github.com/Azure-Samples/microsoft-identity-express/actions/workflows/build-test.yml/badge.svg)](https://github.com/Azure-Samples/microsoft-identity-express/actions/workflows/build-test.yml)
[![E2E](https://github.com/Azure-Samples/microsoft-identity-express/actions/workflows/e2e-test.yml/badge.svg)](https://github.com/Azure-Samples/microsoft-identity-express/actions/workflows/e2e-test.yml)
[![Code Scanning](https://github.com/Azure-Samples/microsoft-identity-express/actions/workflows/codeql.yml/badge.svg)](https://github.com/Azure-Samples/microsoft-identity-express/actions/workflows/codeql.yml)
[![Typedoc](https://github.com/Azure-Samples/microsoft-identity-express/actions/workflows/typedoc.yml/badge.svg)](https://github.com/Azure-Samples/microsoft-identity-express/actions/workflows/typedoc.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

This project illustrates a simple wrapper around the [ConfidentialClientApplication](https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html) class of the [Microsoft Authentication Library for Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node#microsoft-authentication-library-for-node-msal-node) (MSAL Node), in order to streamline routine authentication tasks such as login, logout and token acquisition, as well as securing routes and controlling access. In doing so it takes inspiration from the [Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web) with respect to developer experience.

This is an open source project. [Suggestions](https://github.com/Azure-Samples/microsoft-identity-express/issues/new) and [contributions](https://github.com/Azure-Samples/microsoft-identity-express/blob/dev/CONTRIBUTING.md) are welcome!

> :mega: This project backs the tutorial: [Enable your Node.js web app to sign-in users and call APIs with the Microsoft identity platform](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial)

## Features

* Simple API for authN/authZ with the [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/v2-overview)
* Fetch credentials from [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/general/basic-concepts)
* Handle role-based access with Azure AD [App Roles](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps) and [Security Groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal)
* (coming soon) Handle [Conditional Access](https://docs.microsoft.com/azure/active-directory/develop/v2-conditional-access-dev-guide) and [CAE](https://docs.microsoft.com/azure/active-directory/conditional-access/concept-continuous-access-evaluation)
* (coming soon) Run custom policies with [Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/overview)

> :warning: Protected web API scenarios are currently not supported.

## Prerequisites

* [Node](https://nodejs.org/en/) 14 LTS or higher
* [Express.js](https://expressjs.com/) 4.x or higher
* [@azure/msal-node](https://www.npmjs.com/package/@azure/msal-node)
* [express-session](https://www.npmjs.com/package/express-session) (or a similar session solution)

## Installation

```shell
    npm install azure-samples/microsoft-identity-express 
```

or download and extract the repository *.zip* file.

## Build

```shell
    git clone https://github.com/Azure-Samples/microsoft-identity-express.git
    cd microsoft-identity-express
    npm install
    npm run build
```

> :information_source: This project is generated using [tsdx](https://github.com/formium/tsdx).

## Getting started

### Configuration

1. Initialize the wrapper in your app by providing a settings object. The object looks like the follows:

```javascript
const appSettings = {
    appCredentials: {
        clientId: "CLIENT_ID", // Application (client) ID on Azure AD
        tenantId: "TENANT_ID", // alt. "common" "organizations" "consumers"
        clientSecret: "CLIENT_SECRET" // alt. client certificate or key vault credential
    },
    authRoutes: {
        redirect: "/redirect", // redirect path or the full URI configured on Azure AD
        unauthorized: "/unauthorized", // unauthorized access attempts will be redirected to this route
        frontChannelLogout: "/sso_logout" // front-channel logout path or the full URI configured on Azure AD
    },
    protectedResources: {
        graphAPI: {
            endpoint: "https://graph.microsoft.com/v1.0/me", // Microsoft Graph API
            scopes: ["user.read"]
        },
        armAPI: {
            endpoint: "https://management.azure.com/tenants?api-version=2020-01-01", // Azure Resource Manager REST API
            scopes: ["https://management.azure.com/user_impersonation"]
        }
    }
}
```

1. If you are authenticating with **Azure AD B2C**, user-flows should be provided as well. The first item is used as default authority.

```javascript
const appSettings = {
        // ...
        b2cPolicies: {
            signUpSignIn: {
                authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/B2C_1_susi"
            }
        }
    }
```

### Integration with Express.js

Import the package and instantiate [MsalWebAppAuthClient](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html) class, via the *WebAppAuthClientBuilder*, which exposes the middleware you can use in your routes. The constructor takes the settings object and an (optional) persistent cache:

```javascript
const express = require('express');
const session = require('express-session');
const MsIdExpress = require('microsoft-identity-express');

const settings = require('./appSettings');
const cache = require('./utils/cachePlugin');
const router = require('./routes/router');

const SERVER_PORT = process.env.PORT || 4000;

const app = express();

app.use(session({
    secret: 'ENTER_YOUR_SECRET_HERE',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true on deployment
    }
}));

const msid = new MsIdExpress.WebAppAuthClientBuilder(appSettings).build();

app.use(msid.initialize()); // initialize default routes

app.use(router(msid)); // use MsalWebAppAuthClient in routers downstream

app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}!`));
```

The wrapper stores user data on `req.session` variable. Below are some of the useful variables:

* `req.session.isAuthenticated`: indicates if user is currently authenticated (*boolean*)
* `req.session.account`: MSAL.js account object containing useful information like ID token claims (see [AccountInfo](https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_common.html#accountinfo))
* `req.session.protectedResources.<resourceName>`: Contains parameters related to an Azure AD / Azure AD B2C protected resource, including raw access tokens (see [Resource](https://azure-samples.github.io/microsoft-identity-express/docs/modules.html#resource))

### Middleware

#### Authentication

Add [signIn()](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#signin) and [signOut()](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#signout) middleware to routes you want users to sign-in and sign-out, respectively. You will need to pass the routes for redirect after as parameters to each:

```javascript
const express = require('express');
const appSettings = require('../appSettings');
const mainController = require('../controllers/mainController');

module.exports = (msid) => {

    // initialize router
    const router = express.Router();

    router.get('/', (req, res, next) => res.redirect('/home'));

    router.get('/home', (req, res, next) => {
        res.render('home', { isAuthenticated: req.session.isAuthenticated });
    });

    // auth routes
    router.get('/signin',
        msid.signIn({
            postLoginRedirect: "/",
        }),
    );

    router.get('/signout',
        msid.signOut({
            postLogoutRedirect: "/",
        }),
    );

    // unauthorized
    router.get('/unauthorized', (req, res) => res.redirect('/401.html'));

    router.get('*', (req, res) => res.redirect('/404.html'));

    return router;
}
```

#### Securing routes

Simply add the [isAuthenticated()](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#isauthenticated) middleware before the controller that serves the page you would like to secure:

```javascript
// secure routes
app.get('/id', 
    msid.isAuthenticated(), // checks if authenticated via session
    (req, res, next) => {
        res.render('id', { isAuthenticated: req.session.isAuthenticated, claims: req.session.account.idTokenClaims });
    }
);
```

#### Acquiring tokens

[getToken()](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#gettoken) can be used before middleware that calls a web API. The access token will be available via `req.session`:

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

Use [hasAccess()](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#hasaccess) middleware to control access for Azure AD App Roles and/or Security Groups:

```javascript
    router.use('/admin',
        msid.isAuthenticated(),
        msid.hasAccess({
            accessRule: {
                methods: [ "GET", "POST", "DELETE" ],
                roles: [ "admin_role" ]
            }
        }),
        (req, res) => {
            res.render('dashboard', { isAuthenticated: req.session.isAuthenticated });
        }
    );
```

## Remarks

### Session support

Session support in this sample is provided by the [express-session](https://www.npmjs.com/package/express-session) package using in-memory session store. **in-memory session store** is unfit for production, and you should either use a [compatible session store](https://github.com/expressjs/session#compatible-session-stores) or implement your own storage solution.

### Persistent caching

MSAL Node has an in-memory cache by default. This is not meant to be production-ready. As such, you might want to implement persistent caching using a 3rd party library like [redis](https://redis.io/).

## Information

* [Initializing a confidential client app with MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md)
* [MSAL Node Configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md)
* [Scenario: A web app that calls web APIs](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-overview)
