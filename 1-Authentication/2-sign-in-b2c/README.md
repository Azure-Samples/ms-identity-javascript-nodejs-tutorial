# A Node.js & Express web app authenticating users against Azure AD B2C with MSAL Node

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

This sample demonstrates a Node.js & Express web application that authenticates users against Azure AD B2C, with the help of [Microsoft Authentication Library for Node.js](https://aka.ms/msalnode) (MSAL Node). In doing so, it illustrates authentication concepts such as [OpenID scopes](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes), [ID Tokens](https://docs.microsoft.com/azure/active-directory-b2c/openid-connect), [ID Token validation](https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#validate-the-id-token), [user-flows](https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview) and more.

## Scenario

1. The client application uses **MSAL Node** (via [microsoft-identity-express](https://github.com/Azure-Samples/microsoft-identity-express)) to obtain an ID Token from **Azure AD B2C**.
2. The **ID Token** proves that the user has successfully authenticated against **Azure AD B2C**.

![Overview](./ReadmeFiles/topology.png)

## Contents

| File/folder                 | Description                                                   |
|-----------------------------|---------------------------------------------------------------|
| `AppCreationScripts/`       | Contains Powershell scripts to automate app registration.     |
| `ReadmeFiles/`              | Contains illustrations and screenshots.                       |
| `App/appSettings.js`      | Authentication parameters and settings                        |
| `App/app.js`                | Application entry point.                                      |

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) must be installed to run this sample.
- [Visual Studio Code](https://code.visualstudio.com/download) is recommended for running and editing this sample.
- A modern web browser. This sample uses **ES6** conventions and will not run on **Internet Explorer**.
- An **Azure AD B2C** tenant. For more information see: [How to get an Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant)
- A user account in your **Azure AD B2C** tenant.

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
    cd 1-Authentication\2-sign-in-b2c\App
    npm install
```

## Registration

### Choose the Azure AD tenant where you want to create your applications

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Azure AD B2C tenant, select your profile at the top right corner in the menu on top of the page, and then **switch directory** to change your portal session to the desired Azure AD B2C tenant.

### Create User Flows

Please refer to: [Tutorial: Create user flows in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows)

### Add External Identity Providers

Please refer to: [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-add-identity-providers)

### Register the client app (msal-node-webapp)

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Azure AD B2C** service.
1. Select the **App Registrations** blade on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `msal-node-webapp`.
   - Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
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

#### Configure the client app (msal-node-webapp) to use your app registration

Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `App/appSettings.js` file.
1. Find the key `clientId` and replace the existing value with the application ID (clientId) of `msal-node-webapp` app copied from the Azure portal.
1. Find the key `tenantId` and replace the existing value with your Azure AD B2C tenant ID.
1. Find the key `clientSecret` and replace the existing value with the key you saved during the creation of `msal-node-webapp` copied from the Azure portal.
1. Find the key `redirect` and replace the existing value with the Redirect URI for `msal-node-webapp`. (by default `http://localhost:4000/redirect`).
1. Find the key `b2cPolicies.<policy_name>.authority` and replace it with the authority string of your policies/user-flows, e.g. `https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_susi`.

> :information_source: For `redirect`, you can simply enter the path component of the URI instead of the full URI. For example, instead of `http://localhost:4000/redirect`, you can simply enter `/redirect`. This may come in handy in deployment scenarios.

1. Open the `App/app.js` file.
1. Find the string `ENTER_YOUR_SECRET_HERE` and replace it with a secret that will be used when encrypting your app's session using the [express-session](https://www.npmjs.com/package/express-session) package.

## Running the sample

Locate the root of the sample folder. Then:

```console
    npm start
```

## Explore the sample

1. Open your browser and navigate to `http://localhost:4000`.
1. Click the **sign-in** button on the top right corner.
1. Once signed in, select the **ID** button to see some of the claims in your ID token.

![Screenshot](./ReadmeFiles/screenshot.png)

> :information_source: Did the sample not work for you as expected? Then please reach out to us using the [GitHub Issues](../../../../issues) page.

## We'd love your feedback!

Were we successful in addressing your learning objective? Consider taking a moment to [share your experience with us](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUQkRCSVdRSk8wUjdZSkg2NEZGOFFaTkxQVyQlQCN0PWcu).

## About the code

### Initialization

In [app.js](./App/app.js), we instantiate the [MsalWebAppAuthClient](https://azure-samples.github.io/microsoft-identity-express/classes/MsalWebAppAuthClient.html) class. Once instantiated, **MsalWebAppAuthClient** exposes the [initialize()](https://azure-samples.github.io/microsoft-identity-express/classes/MsalWebAppAuthClient.html#initialize) middleware, which sets the default routes for handling redirect response from Azure AD and etc.

```javascript
const express = require('express');
const session = require('express-session');
const MsIdExpress = require('microsoft-identity-express');

const SERVER_PORT = process.env.PORT || 4000;

// initialize express
const app = express(); 

// microsoft-identity-express requires session support
// here we set express-session
app.use(session({
    secret: 'ENTER_YOUR_SECRET_HERE',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set this to true on production
    }
));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// instantiate the wrapper
const msid = new MsIdExpress.WebAppAuthClientBuilder(appSettings).build();

// initialize the wrapper
app.use(msid.initialize());

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
```

The `msid` object exposes several middlewares that you can use in your routes for authN/authZ tasks (see [app.js](./App/app.js)):

```javascript
// authentication routes
app.get('/signin', 
    msid.signIn({
        postLoginRedirect: '/',
        failureRedirect: '/signin'
    }
));

app.get('/signout', 
    msid.signOut({
        postLogoutRedirect: '/'
    }
));
```

Under the hood, the wrapper creates an **MSAL Node** [configuration object](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md) and instantiates the MSAL Node [ConfidentialClientApplication](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/src/client/ConfidentialClientApplication.ts) class by passing it:

```typescript
class MsalWebAppAuthClient extends BaseAuthClient {
    constructor(appSettings: AppSettings, msalConfig: Configuration) {
        super(appSettings, msalConfig);
    }

    // ...
}
```

### Sign-in

The user clicks on the **sign-in** button and routes to `/signin`. From there, the [signIn()](https://azure-samples.github.io/microsoft-identity-express/classes/MsalWebAppAuthClient.html#signIn) middleware takes over. It creates and encodes a state object to pass with an authorization code request. The object is passed to the `state` parameter as a means of controlling the application flow. For more information, see [Pass custom state in authentication requests using MSAL](https://docs.microsoft.com/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request).

```typescript
   signIn(
      options: SignInOptions = {
         postLoginRedirect: '/',
         failureRedirect: '/',
      }
   ): RequestHandler {
      return (req: Request, res: Response, next: NextFunction): Promise<void> => {
         const appState = {
               appStage: AppStages.SIGN_IN,
               redirectTo: options.postLoginRedirect,
               csrfToken: req.session.csrfToken,
         } as AppState;

         const authUrlParams = {
               scopes: OIDC_DEFAULT_SCOPES,
         } as AuthorizationUrlRequest;

         const authCodeParams = {
               scopes: OIDC_DEFAULT_SCOPES,
         } as AuthorizationCodeRequest;

         // get url to sign user in
         return this.redirectToAuthCodeUrl(req, res, next, authUrlParams, authCodeParams, appState);
      };
   }
```

The `redirectToAuthCodeUrl()` method assigns request parameters and calls the **MSAL Node**'s [getAuthCodeUrl()](https://azure-samples.github.io/microsoft-identity-express/classes/MsalWebAppAuthClient.html#getAuthCodeUrl) API. It then redirects the app to auth code URL:

```typescript
   private async redirectToAuthCodeUrl(
        req: Request,
        res: Response,
        next: NextFunction,
        authUrlParams: AuthorizationUrlRequest,
        authCodeParams: AuthorizationCodeRequest,
        appState: AppState
    ): Promise<void> {
        // add session csrfToken for crsf
        req.session.csrfToken = this.cryptoProvider.createNewGuid();

        const key = this.cryptoUtils.createKey(req.session.csrfToken, this.cryptoUtils.generateSalt());
        req.session.key = key.toString('hex');

        const state = JSON.stringify({
            ...appState,
            csrfToken: req.session.csrfToken,
        });

        // prepare the request
        req.session.authorizationUrlRequest = {
            ...authUrlParams,
            state: this.cryptoProvider.base64Encode(this.cryptoUtils.encryptData(state, key)),
            redirectUri: UrlUtils.ensureAbsoluteUrl(req, this.webAppSettings.authRoutes.redirect),
            responseMode: ResponseMode.FORM_POST
        };

        req.session.authorizationCodeRequest = {
            ...authCodeParams,
            redirectUri: UrlUtils.ensureAbsoluteUrl(req, this.webAppSettings.authRoutes.redirect),
            code: ''
        };

        // request an authorization code to exchange for tokens
        try {
            const response = await this.msalClient.getAuthCodeUrl(req.session.authorizationUrlRequest);
            res.redirect(response);
        } catch (error) {
            next(error);
        }
    }
```

After making an authorization code URL request, the user is redirected to the redirect route defined in the **Azure AD** app registration. Once redirected, the [handleRedirect()](https://azure-samples.github.io/microsoft-identity-express/classes/MsalWebAppAuthClient.html#handleRedirect) middleware takes over. It first checks for `csrfToken` parameter in state against *cross-site resource forgery* (CSRF) attacks, and then for the current app stage. Then, using the `code` in query parameters, an access and an ID token are requested using the **MSAL Node**'s [acquireTokenByCode()](https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html#acquiretokenbycode) API, and the response is appended to the **express-session** variable.

```typescript
   private handleRedirect(): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            if (!req.session.key) {
                this.logger.error(ErrorMessages.SESSION_KEY_NOT_FOUND);
                return next(new Error(ErrorMessages.SESSION_KEY_NOT_FOUND));
            }

            if (!req.session.authorizationCodeRequest) {
                this.logger.error(ErrorMessages.AUTH_CODE_REQUEST_OBJECT_NOT_FOUND);
                return next(new Error(ErrorMessages.AUTH_CODE_REQUEST_OBJECT_NOT_FOUND));
            }

            if (req.body.state) {
                const state: AppState = JSON.parse(
                    this.cryptoUtils.decryptData(
                        this.cryptoProvider.base64Decode(req.body.state as string),
                        Buffer.from(req.session.key, 'hex')
                    )
                );

                // check if csrfToken matches
                if (state.csrfToken === req.session.csrfToken) {
                    switch (state.appStage) {
                        case AppStages.SIGN_IN: {
                            // token request should have auth code
                            req.session.authorizationCodeRequest.code = req.body.code as string;

                            try {
                                // exchange auth code for tokens
                                const tokenResponse = await this.msalClient.acquireTokenByCode(
                                    req.session.authorizationCodeRequest
                                );

                                if (!tokenResponse) return res.redirect(this.webAppSettings.authRoutes.unauthorized);

                                req.session.isAuthenticated = true;
                                req.session.account = tokenResponse.account!; // this won't be null in any web app scenario
                                res.redirect(state.redirectTo);
                            } catch (error) {
                                next(error);
                            }
                            break;
                        }

                        case AppStages.ACQUIRE_TOKEN: {
                            // get the name of the resource associated with scope
                            const resourceName = ConfigHelper.getResourceNameFromScopes(
                                req.session.authorizationCodeRequest.scopes,
                                this.webAppSettings
                            );

                            req.session.authorizationCodeRequest.code = req.body.code as string;

                            try {
                                const tokenResponse = await this.msalClient.acquireTokenByCode(
                                    req.session.authorizationCodeRequest
                                );

                                if (!tokenResponse) return res.redirect(this.webAppSettings.authRoutes.unauthorized);

                                req.session.protectedResources = {
                                    [resourceName]: {
                                        accessToken: tokenResponse.accessToken,
                                    } as Resource,
                                };

                                res.redirect(state.redirectTo);
                            } catch (error) {
                                next(error);
                            }
                            break;
                        }

                        default:
                            next(new Error(ErrorMessages.CANNOT_DETERMINE_APP_STAGE));
                            break;
                    }
                } else {
                    res.redirect(this.webAppSettings.authRoutes.unauthorized);
                }
            } else {
                res.redirect(this.webAppSettings.authRoutes.unauthorized);
            }
        };
    };
```

### Secure routes

Simply add the [isAuthenticated()](https://azure-samples.github.io/microsoft-identity-express/classes/MsalWebAppAuthClient.html#isAuthenticated) middleware to your route, before the controller that displays the page you want to be secure. This would require any user to be authenticated to access this route:

```javascript
// secure routes
app.get('/id', 
   msid.isAuthenticated(), 
   mainController.getIdPage
);
```

`isAuthenticated()` middleware checks the user's `isAuthenticated` session variable, which is assigned during sign-in flow. You can customize `isAuthenticated()` middleware to redirect an unauthenticated user to the sign-in page if you wish so. See [appSettings.js](./App/appSettings.js)

```typescript
   isAuthenticated(): RequestHandler {
      return (req: Request, res: Response, next: NextFunction): void => {
         if (!req.session.isAuthenticated) {
               return res.redirect(this.webAppSettings.authRoutes.unauthorized);
         }

         next();
      };
   };
```

### Sign-out

To sign out, the wrapper's [signOut()](https://azure-samples.github.io/microsoft-identity-express/classes/MsalWebAppAuthClient.html#signOut) middleware constructs a logout URL following the [guide here](https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request). Then, we clear the cache, destroy the current **express-session** and redirect the user to the **sign-out endpoint**:

```typescript
   signOut(
         options: SignOutOptions = {
            postLogoutRedirect: '/',
         }
      ): RequestHandler {
         return async (req: Request, res: Response): Promise<void> => {
            const postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(req, options.postLogoutRedirect);

            /**
             * Construct a logout URI and redirect the user to end the
             * session with Azure AD/B2C. For more information, visit:
             * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
             * (B2C) https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
             */
            const logoutUri = `${this.msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`;

            const tokenCache = this.msalClient.getTokenCache();

            const account = req.session.account?.homeAccountId
                  ?
                  await tokenCache.getAccountByHomeId(req.session.account.homeAccountId)
                  :
                  await tokenCache.getAccountByLocalId(req.session.account?.localAccountId!);

            if (account) {
                  await tokenCache.removeAccount(account);
            }

            req.session.destroy(() => {
                  res.redirect(logoutUri);
            });
         };
      }
```

## More information

- [What is Azure Active Directory B2C?](https://docs.microsoft.com/azure/active-directory-b2c/overview)
- [Application types that can be used in Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/application-types)
- [Recommendations and best practices for Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/best-practices)
- [Azure AD B2C session](https://docs.microsoft.com/azure/active-directory-b2c/session-overview)
- [Initialize client applications using MSAL.js](https://docs.microsoft.com/azure/active-directory/develop/msal-js-initializing-client-applications)
- [Single sign-on with MSAL.js](https://docs.microsoft.com/azure/active-directory/develop/msal-js-sso)
- [Handle MSAL.js exceptions and errors](https://docs.microsoft.com/azure/active-directory/develop/msal-handling-exceptions?tabs=javascript)
- [Logging in MSAL.js applications](https://docs.microsoft.com/azure/active-directory/develop/msal-logging?tabs=javascript)
- [Pass custom state in authentication requests using MSAL.js](https://docs.microsoft.com/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request)
- [Prompt behavior in MSAL.js interactive requests](https://docs.microsoft.com/azure/active-directory/develop/msal-js-prompt-behavior)
- [Use MSAL.js to work with Azure AD B2C](https://docs.microsoft.com/azure/active-directory/develop/msal-b2c-overview)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD](https://docs.microsoft.com/azure/active-directory/develop/authentication-flows-app-scenarios).

## Community Help and Support

Use [Stack Overflow](http://stackoverflow.com/questions/tagged/msal) to get support from the community.
Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Make sure that your questions or comments are tagged with [`azure-active-directory` `azure-ad-b2c` `ms-identity` `adal` `msal`].

If you find a bug in the sample, raise the issue on [GitHub Issues](../../../../issues).

To provide feedback on or suggest features for Azure Active Directory, visit [User Voice page](https://feedback.azure.com/forums/169401-azure-active-directory).

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](/CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.