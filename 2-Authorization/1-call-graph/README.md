# A Node.js & Express web app calling Microsoft Graph using MSAL Node

 1. [Overview](#overview)
 1. [Scenario](#scenario)
 1. [Contents](#contents)
 1. [Prerequisites](#prerequisites)
 1. [Setup](#setup)
 1. [Registration](#registration)
 1. [Running the sample](#running-the-sample)
 1. [Explore the sample](#explore-the-sample)
 1. [About the code](#about-the-code)
 1. [More information](#more-information)
 1. [Community Help and Support](#community-help-and-support)
 1. [Contributing](#contributing)

## Overview

This sample demonstrates a Node.js & Express web application that authenticates users against [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis) (Azure AD) and obtains [access tokens](https://docs.microsoft.com/azure/active-directory/develop/access-tokens) to call [Microsoft Graph](https://docs.microsoft.com/graph/overview) (MS Graph) and [Azure Resource Manager API](https://docs.microsoft.com/azure/azure-resource-manager/management/overview) (ARM API), with the help of [Microsoft Authentication Library for Node.js](https://aka.ms/msalnode) (MSAL Node).  In doing so, it illustrates authorization concepts such as [OAuth 2.0 Authorization Code Grant](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow), [dynamic scopes and incremental consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent), **working with multiple resources** and more.

This sample also demonstrates how to use the [Microsoft Graph JavaScript SDK](https://github.com/microsoftgraph/msgraph-sdk-javascript) for working with the Microsoft Graph API.

> :information_source: Check out the community call: [An introduction to Microsoft Graph for developers](https://www.youtube.com/watch?v=EBbnpFdB92A)

## Scenario

1. The client application uses **MSAL Node** (via [microsoft-identity-express](https://github.com/Azure-Samples/microsoft-identity-express)) to sign-in a user and obtain a JWT **Access Token** from **Azure AD**.
1. The **Access Token** is used as a *bearer* token to authorize the user to access the **resource server** ([MS Graph](https://aka.ms/graph) or [Azure REST API](https://docs.microsoft.com/rest/api/azure/)).
1. The **resource server** responds with the resource that the user has access to.

![Overview](./ReadmeFiles/topology.png)

## Contents

| File/folder                 | Description                                                   |
|-----------------------------|---------------------------------------------------------------|
| `AppCreationScripts/`       | Contains Powershell scripts to automate app registration.     |
| `ReadmeFiles/`              | Contains illustrations and screenshots.                       |
| `App/appSettings.js`      | Authentication parameters and settings.                         |
| `App/app.js`                | Application entry point.                                      |
| `App/utils/graphManager.js` | Handles calls to Microsoft Graph using Graph JS SDK.          |
| `App/utils/fetchManager.js` | Handles calls to protected APIs using Axios package.          |

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) must be installed to run this sample.
- [Visual Studio Code](https://code.visualstudio.com/download) is recommended for running and editing this sample.
- [VS Code Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension is recommended for interacting with Azure through VS Code Interface.
- A modern web browser. This sample uses **ES6** conventions and will not run on **Internet Explorer**.
- An **Azure AD** tenant. For more information, see: [How to get an Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant)
- A user account in your **Azure AD** tenant. This sample will not work with a **personal Microsoft account**.  If you're signed in to the [Azure portal](https://portal.azure.com) with a personal Microsoft account and have not created a user account in your directory before, you will need to create one before proceeding.

## Setup

### Step 1: Clone or download this repository

From your shell or command line:

```console
    git clone https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial.git
```

or download and extract the repository .zip file.

> :warning: To avoid path length limitations on Windows, we recommend cloning into a directory near the root of your drive.

### Step 2: Install project dependencies

Locate the root of the sample folder. Then:

```console
    cd 2-Authorization/1-call-graph/App
    npm install
```

## Registration

There is one project in this sample. To register it, you can:

- follow the steps below for manually register your apps
- or use PowerShell scripts that:
  - **automatically** creates the Azure AD applications and related objects (passwords, permissions, dependencies) for you.
  - modify the projects' configuration files.

<details>
  <summary>Expand this section if you want to use this automation:</summary>

> :warning: If you have never used **Azure AD Powershell** before, we recommend you go through the [App Creation Scripts](./AppCreationScripts/AppCreationScripts.md) once to ensure that your environment is prepared correctly for this step.

1. On Windows, run PowerShell as **Administrator** and navigate to the root of the cloned directory
1. If you have never used Azure AD Powershell before, we recommend you go through the [App Creation Scripts](./AppCreationScripts/AppCreationScripts.md) once to ensure that your environment is prepared correctly for this step.
1. In PowerShell run:

   ```PowerShell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
   ```

1. Run the script to create your Azure AD application and configure the code of the sample application accordingly.
1. In PowerShell run:

   ```PowerShell
   cd .\AppCreationScripts\
   .\Configure.ps1
   ```

   > Other ways of running the scripts are described in [App Creation Scripts](./AppCreationScripts/AppCreationScripts.md)
   > The scripts also provide a guide to automated application registration, configuration and removal which can help in your CI/CD scenarios.

</details>

### Choose the Azure AD tenant where you want to create your applications

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Azure AD tenant, select your profile at the top right corner in the menu on top of the page, and then **switch directory** to change your portal session to the desired Azure AD tenant.

### Register the client app (msal-node-webapp)

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Azure AD** service.
1. Select the **App Registrations** blade on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `msal-node-webapp`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:4000/redirect`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file(s) later in your code.
1. Select **Save** to save your changes.
1. In the app's registration screen, select the **Certificates & secrets** blade in the left to open the page where you can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**:
   - Type a key description (for instance `app secret`),
   - Select one of the available key durations (**6 months**, **12 months** or **Custom**) as per your security posture.
   - The generated key value will be displayed when you select the **Add** button. Copy and save the generated value for use in later steps.
   - You'll need this key later in your code's configuration files. This key value will not be displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.
1. In the app's registration screen, select the **API permissions** blade in the left to open the page where we add access to the APIs that your application needs.
   - Select the **Add a permission** button and then:
       - Ensure that the **Microsoft APIs** tab is selected.
       - In the *Commonly used Microsoft APIs* section, select **Microsoft Graph**
       - In the **Delegated permissions** section, select the **User.Read** in the list. Use the search box if necessary.
       - Select the **Add permissions** button at the bottom.
   - Select the **Add a permission** button and then:
       - Ensure that the **Microsoft APIs** tab is selected.
       - In the list of APIs, select the API `Windows Azure Service Management API`.
       - In the **Delegated permissions** section, select the **user_impersonation** in the list. Use the search box if necessary.
       - Select the **Add permissions** button at the bottom.

#### Configure the client app (msal-node-webapp) to use your app registration

Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `App/appSettings.js` file.
1. Find the key `clientId` and replace the existing value with the application ID (clientId) of `msal-node-webapp` app copied from the Azure portal.
1. Find the key `tenantId` and replace the existing value with your Azure AD tenant ID.
1. Find the key `clientSecret` and replace the existing value with the key you saved during the creation of `msal-node-webapp` copied from the Azure portal.
1. Find the key `redirect` and replace the existing value with the Redirect URI for `msal-node-webapp`. (by default `http://localhost:4000/redirect`).

> :information_source: For `redirect`, you can simply enter the path component of the URI instead of the full URI. For example, instead of `http://localhost:4000/redirect`, you can simply enter `/redirect`. This may come in handy in deployment scenarios.

The rest of the **key-value** pairs are for resources/APIs that you would like to call. They are set as **default**, but you can modify them as you wish:

```js
{
    protectedResources: {
        nameOfYourResource: {
            endpoint: "<uri_coordinates_of_the_resource>",
            scopes: ["scope1_of_the_resource", "scope2_of_the_resource", "..."]
        },
    }
}
```

1. Open the `App/app.js` file.
1. Find the string `ENTER_YOUR_SECRET_HERE` and replace it with a secret that will be used when encrypting your app's session using the [express-session](https://www.npmjs.com/package/express-session) package.

## Running the sample

Locate the root of the sample folder. Then:

```console
    npm start
```

## Explore the sample

1. Open your browser and navigate to `http://localhost:4000`.
1. Click the **Sign-in** button on the top right corner.
1. Once you sign in, click on the **See my profile** button to call **Microsoft Graph**.
1. Once you sign in, click on the **Get my tenant** button to call **Azure Resource Manager**.

![Screenshot](./ReadmeFiles/screenshot.png)

> :information_source: Did the sample not work for you as expected? Then please reach out to us using the [GitHub Issues](../../../../issues) page.

## We'd love your feedback!

Were we successful in addressing your learning objective? Consider taking a moment to [share your experience with us](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUQkRCSVdRSk8wUjdZSkg2NEZGOFFaTkxQVyQlQCN0PWcu).

## About the code

### Protected resources and scopes

In order for an app to access a protected resource on behalf of a signed-in user, the app needs to present a valid **Access Token** to that resource owner (for example, Microsoft Graph). The intended recipient of an **Access Token** is represented by the `aud` claim (in this case, it should be the Microsoft Graph API's App ID); in case the value for the `aud` claim does not mach the resource **APP ID URI**, the token should be considered invalid. Likewise, the permissions that an **Access Token** grants is represented by the `scp` claim. See [Access Token claims](https://docs.microsoft.com/azure/active-directory/develop/access-tokens#payload-claims) for more information.

Scopes can come in various forms so it pays off to be familiar with them. The following are all resource scopes:

- `user.read` - short-hand expression for Microsoft Graph **User** resource scope
- `https://management.azure.com/user_impersonation` - https expression of a multi-tenant resource scope
- `api://9k8521c1-bab5-1256-a87b-574f83c463z6/access_as_user` - expression of a single-tenant resource (e.g. a custom web API) scope

### Acquiring an access token

```javascript
const express = require('express');
const session = require('express-session');
const MsIdExpress = require('microsoft-identity-express');
const appSettings = require('./appSettings.js');

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
        secure: false, // set this to true on production
    }
}));

// instantiate the wrapper
const msid = new MsIdExpress.WebAppAuthClientBuilder(appSettings).build();

// initialize the wrapper
app.use(msid.initialize());

// app routes
app.get('/', (req, res, next) => res.redirect('/home'));
app.get('/home', mainController.getHomePage);

// authentication routes
app.get('/signin', msid.signIn({ postLoginRedirect: '/' }));
app.get('/signout', msid.signOut({ postLogoutRedirect: '/' }));

app.get('/profile',
    msid.isAuthenticated(), 
    msid.getToken({
        resource: appSettings.protectedResources.graphAPI
    }), 
    mainController.getProfilePage
);

app.get('/tenant',
    msid.isAuthenticated(),
    msid.getToken({
        resource: appSettings.protectedResources.armAPI
    }),
    mainController.getTenantPage
);

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
```

Under the hood, the [getToken()](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#gettoken) middleware grabs resource endpoint and associated scope from [appSettings.js](./App/appSettings.js), and attempts to obtain an access token from cache silently and attaches it to session. If silent token acquisition fails for some reason (e.g. consent required), it makes an auth code request, which triggers the first leg of auth code flow.

```typescript
getToken(options: TokenRequestOptions): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        // get scopes for token request
        const scopes = options.resource.scopes;
        const resourceName = ConfigHelper.getResourceNameFromScopes(scopes, this.appSettings)

        if (!req.session.protectedResources) {
            req.session.protectedResources = {}
        }

        req.session.protectedResources = {
            [resourceName]: {
                ...this.appSettings.protectedResources[resourceName],
                accessToken: null,
            } as Resource
        };

        try {
            const silentRequest: SilentFlowRequest = {
                account: req.session.account,
                scopes: scopes,
            };

            // acquire token silently to be used in resource call
            const tokenResponse: AuthenticationResult = await this.msalClient.acquireTokenSilent(silentRequest);

            // In B2C scenarios, sometimes an access token is returned empty.
            // In that case, we will acquire token interactively instead.
            if (StringUtils.isEmpty(tokenResponse.accessToken)) {
                this.logger.error(ErrorMessages.TOKEN_NOT_FOUND);
                throw new InteractionRequiredAuthError(ErrorMessages.INTERACTION_REQUIRED);
            }

            req.session.protectedResources[resourceName].accessToken = tokenResponse.accessToken;
            next();
        } catch (error) {
            // in case there are no cached tokens, initiate an interactive call
            if (error instanceof InteractionRequiredAuthError) {
                const state = this.cryptoProvider.base64Encode(
                    JSON.stringify({
                        stage: AppStages.ACQUIRE_TOKEN,
                        path: req.originalUrl,
                        nonce: req.session.nonce,
                    })
                );

                const params: AuthCodeParams = {
                    authority: this.msalConfig.auth.authority,
                    scopes: scopes,
                    state: state,
                    redirect: UrlUtils.ensureAbsoluteUrl(req, this.appSettings.authRoutes.redirect),
                    account: req.session.account,
                };

                // initiate the first leg of auth code grant to get token
                return this.getAuthCode(req, res, next, params);
            } else {
                next(error);
            }
        }
    }
};
```

In the second leg of auth code flow, the auth code from redirect response is used to request a new access token (and a refresh token) via the [handleRedirect](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#handleredirect) middleware.

```typescript
handleRedirect = (options?: HandleRedirectOptions): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (req.query.state) {
            const state = JSON.parse(this.cryptoProvider.base64Decode(req.query.state as string));

            // check if nonce matches
            if (state.nonce === req.session.nonce) {
                switch (state.stage) {
                    
                    // ...

                    case AppStages.ACQUIRE_TOKEN: {
                        // get the name of the resource associated with scope
                        const resourceName = ConfigHelper.getResourceNameFromScopes(req.session.tokenRequest.scopes, this.appSettings);

                        req.session.tokenRequest.code = req.query.code as string;

                        try {
                            const tokenResponse: AuthenticationResult = await this.msalClient.acquireTokenByCode(req.session.tokenRequest);
                            req.session.protectedResources[resourceName].accessToken = tokenResponse.accessToken;
                            res.redirect(state.path);
                        } catch (error) {
                            this.logger.error(ErrorMessages.TOKEN_ACQUISITION_FAILED);
                            next(error);
                        }
                        break;
                    }

                    default:
                        console.log(ErrorMessages.CANNOT_DETERMINE_APP_STAGE);
                        res.redirect(this.appSettings.authRoutes.error);
                        break;
                }
            } else {
                console.log(ErrorMessages.NONCE_MISMATCH);
                res.redirect(this.appSettings.authRoutes.unauthorized);
            }
        } else {
            console.log(ErrorMessages.STATE_NOT_FOUND)
            res.redirect(this.appSettings.authRoutes.unauthorized);
        }
    }
};
```

### Access Token validation

Clients should treat access tokens as opaque strings, as the contents of the token are intended for the **resource only** (such as a web API or Microsoft Graph). For debugging purposes, developers can decode **JWT**s (*JSON Web Tokens*) using a site like [jwt.ms](https://jwt.ms).

### Calling Microsoft Graph via Graph JS SDK

The Microsoft Graph JavaScript SDK is a lightweight wrapper around the Microsoft Graph API that can be used server-side and in the browser. It provides an API that allows easy interaction when querying Microsoft Graph. While the SDK can handle token acquisition by itself in certain scenarios, we provide the access token in this sample as shown below:

```javascript
const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

/**
 * Creating a Graph client instance via options method. For more information, visit:
 * https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/dev/docs/CreatingClientInstance.md#2-create-with-options
 */
getAuthenticatedClient = (accessToken) => {
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate requests
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
}
```

Then, in a controller, simply call the Graph via the `graphClient`:

```javascript
exports.getProfilePage = async (req, res, next) => {
    let profile;

    try {
        const graphClient = graphManager.getAuthenticatedClient(req.session.protectedResources["graphAPI"].accessToken);

        profile = await graphClient
            .api('/me')
            .get();

    } catch (error) {
        console.log(error)
    }

    res.render('profile', { isAuthenticated: req.session.isAuthenticated, profile: profile });
}
```

### Calling a protected API

To call any other protected API, simply make a http GET request to the resource endpoint using the bearer token authentication scheme as shown below:

```javascript
const { default: axios } = require('axios');

callAPI = async(endpoint, accessToken) => {

    if (!accessToken || accessToken === "") {
        throw new Error('No tokens found')
    }
    
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };
    
    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.default.get(endpoint, options);
        return response.data;
    } catch(error) {
        console.log(error)
        return error;
    }
}
```

Then, in a controller, simply call the utility method:

```javascript
exports.getTenantPage = async (req, res, next) => {
    let tenant;

    try {
        tenant = await fetchManager.callAPI(appSettings.protectedResources.armAPI.endpoint, req.session.protectedResources["armAPI"].accessToken);
    } catch (error) {
        console.log(error)
    }

    res.render('tenant', { isAuthenticated: req.session.isAuthenticated, tenant: tenant.value[0] });
}
```

## More information

Configure your application:

- [Initialize client applications using MSAL.js](https://docs.microsoft.com/azure/active-directory/develop/msal-js-initializing-client-applications)
- [Single sign-on with MSAL.js](https://docs.microsoft.com/azure/active-directory/develop/msal-js-sso)
- [Handle MSAL.js exceptions and errors](https://docs.microsoft.com/azure/active-directory/develop/msal-handling-exceptions?tabs=javascript)
- [Logging in MSAL.js applications](https://docs.microsoft.com/azure/active-directory/develop/msal-logging?tabs=javascript)
- [Pass custom state in authentication requests using MSAL.js](https://docs.microsoft.com/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request)
- [Prompt behavior in MSAL.js interactive requests](https://docs.microsoft.com/azure/active-directory/develop/msal-js-prompt-behavior)

Learn more about the Microsoft identity platform:

- [Microsoft identity platform (Azure Active Directory for developers)](https://docs.microsoft.com/azure/active-directory/develop/)
- [Overview of Microsoft Authentication Library (MSAL)](https://docs.microsoft.com/azure/active-directory/develop/msal-overview)
- [Understanding Azure AD application consent experiences](https://docs.microsoft.com/azure/active-directory/develop/application-consent-experience)
- [Understand user and admin consent](https://docs.microsoft.com/azure/active-directory/develop/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent)
- [Microsoft identity platform and OpenID Connect protocol](https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc)
- [Microsoft Identity Platform ID Tokens](https://docs.microsoft.com/azure/active-directory/develop/id-tokens)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD](https://docs.microsoft.com/azure/active-directory/develop/authentication-flows-app-scenarios).

## Community Help and Support

Use [Stack Overflow](http://stackoverflow.com/questions/tagged/msal) to get support from the community.
Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Make sure that your questions or comments are tagged with [`azure-active-directory` `node` `ms-identity` `adal` `msal`].

If you find a bug in the sample, raise the issue on [GitHub Issues](../../../../issues).

To provide feedback on or suggest features for Azure Active Directory, visit [User Voice page](https://feedback.azure.com/forums/169401-azure-active-directory).

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](/CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.