---
page_type: sample
name: A React SPA with a Node.Js (Express) back-end using the Backend For Frontend (BFF) Proxy architecture to authenticate users with Azure AD and calling Microsoft Graph
description: A React SPA with a Node.Js (Express) back-end using the Backend For Frontend (BFF) Proxy architecture to authenticate users with Azure AD and calling Microsoft Graph on the user's behalf
languages:
 - javascript
products:
 - azure-active-directory
 - msal-js
 - msal-node
 - ms-graph
urlFragment: ms-identity-javascript-nodejs-tutorial
extensions:
- services: ms-identity
- platform: JavaScript
- endpoint: AAD v2.0
- level: 300
- client: React SPA with Express backend
- service: MS Graph
---

# A React SPA with a Node.js (Express) web app using the Backend For Frontend (BFF) Proxy architecture to authenticate users with Azure AD and call Microsoft Graph

* [Overview](#overview)
* [Scenario](#scenario)
* [Contents](#contents)
* [Prerequisites](#prerequisites)
* [Setup the sample](#setup-the-sample)
* [Explore the sample](#explore-the-sample)
* [Troubleshooting](#troubleshooting)
* [About the code](#about-the-code)
* [Next Steps](#next-steps)
* [Contributing](#contributing)
* [Learn More](#learn-more)

## Overview

This sample demonstrates a React single-page application (SPA) with an Node.js Express backend that authenticates users and calls the Microsoft Graph API using the backend for frontend (BFF) proxy architecture. In this architecture, access tokens are retrieved and stored within the secure backend context, and the client side JavaScript application, which is served by the Express web app, is only indirectly involved in the authN/authZ process by routing the token and API requests to the backend. The trust between the frontend and backend is established via a secure cookie upon successful sign-in.

> :information_source: To learn how applications integrate with [Microsoft Graph](https://aka.ms/graph), consider going through the recorded session: [An introduction to Microsoft Graph for developers](https://www.youtube.com/watch?v=EBbnpFdB92A)

## Scenario

1. The client-side React SPA initiates token acquisition by calling the login endpoint of the Express web app.
1. Express web app uses **MSAL Node** to sign-in a user and obtain a JWT [ID Token](https://aka.ms/id-tokens) and an [Access Token](https://aka.ms/access-tokens) from **Azure AD**.
1. Express web app uses the **access token** as a *bearer* token to authorize the user to call the Microsoft Graph API protected by **Azure AD**.
1. Express web app returns the Microsoft Graph `/me` endpoint response back to the React SPA.

![Scenario Image](./ReadmeFiles/sequence.png)

## Contents

| File/folder                      |                                Description                                 |
|--------------------------------- |----------------------------------------------------------------------------|
| `app.js`                         | Application entry point.                                                   |
| `authConfig.js`                  | Contains authentication configuration parameters.                          |
| `auth/AuthProvider.js`           | A custom wrapper around MSAL Node for authN/authZ.                         |
| `utils/graphClient`              | Instantiates Graph SDK client using a custom authentication provider.      |
| `client/src/context/AuthContext` | React context to fetch user information from the backend.                  |
| `client/src/pages/Profile`       | Calls `auth/profile` route on backend to call the Microsoft Graph `/me` endpoint   |

## Prerequisites

* [Node.js](https://nodejs.org/en/download/) must be installed to run this sample.
* [Visual Studio Code](https://code.visualstudio.com/download) is recommended for running and editing this sample.
* [VS Code Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension is recommended for interacting with Azure through VS Code Interface.
* A modern web browser.
* An **Azure AD** tenant. For more information, see: [How to get an Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/test-setup-environment#get-a-test-tenant)
* A user account in your **Azure AD** tenant.

## Setup the sample

### Step 1: Clone or download this repository

From your shell or command line:

```console
git clone https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial.git
```

or download and extract the repository *.zip* file.

> :warning: To avoid path length limitations on Windows, we recommend cloning into a directory near the root of your drive.

### Step 2: Install project dependencies

```console
    cd 5-AdvancedScenarios\1-call-graph-bff\App
    npm install
```

### Step 3: Register the sample application(s) in your tenant

There is one project in this sample. To register it, you can:

* follow the steps below for manually register your apps
* or use PowerShell scripts that:
  * **automatically** creates the Azure AD applications and related objects (passwords, permissions, dependencies) for you.
  * modify the projects' configuration files.

<details>
   <summary>Expand this section if you want to use this automation:</summary>

> :warning: If you have never used **Microsoft Graph PowerShell** before, we recommend you go through the [App Creation Scripts Guide](./AppCreationScripts/AppCreationScripts.md) once to ensure that your environment is prepared correctly for this step.
  
1. On Windows, run PowerShell as **Administrator** and navigate to the root of the cloned directory
1. In PowerShell run:

    ```PowerShell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
    ```

1. Run the script to create your Azure AD application and configure the code of the sample application accordingly.
1. For interactive process -in PowerShell, run:

    ```PowerShell
    cd .\AppCreationScripts\
    .\Configure.ps1 -TenantId "[Optional] - your tenant id" -AzureEnvironmentName "[Optional] - Azure environment, defaults to 'Global'"
    ```

Other ways of running the scripts are described in [App Creation Scripts guide](./AppCreationScripts/AppCreationScripts.md). The scripts also provide a guide to automated application registration, configuration and removal which can help in your CI/CD scenarios.

> :information_source: This sample can make use of client certificates. You can use **AppCreationScripts** to register an Azure AD application with certificates. See: [How to use certificates instead of client secrets](./README-use-certificate.md)

</details>

#### Choose the Azure AD tenant where you want to create your applications

To manually register the apps, as a first step you'll need to:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Azure AD tenant, select your profile at the top right corner in the menu on top of the page, and then **switch directory** to change your portal session to the desired Azure AD tenant.

#### Register the service app (msal-node-webapp)

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Azure Active Directory** service.
1. Select the **App Registrations** blade on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
    1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `msal-node-webapp`.
    1. Under **Supported account types**, select **Accounts in this organizational directory only**
    1. Select **Register** to create the application.
1. In the **Overview** blade, find and note the **Application (client) ID**. You use this value in your app's configuration file(s) later in your code.
1. In the app's registration screen, select the **Authentication** blade to the left.
1. If you don't have a platform added, select **Add a platform** and select the **Web** option.
    1. In the **Redirect URI** section enter the following redirect URI:
        1. `http://localhost:3000/auth/redirect`
    1. Click **Save** to save your changes.
1. In the app's registration screen, select the **Certificates & secrets** blade in the left to open the page where you can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**:
    1. Type a key description (for instance `app secret`).
    1. Select one of the available key durations (**6 months**, **12 months** or **Custom**) as per your security posture.
    1. The generated key value will be displayed when you select the **Add** button. Copy and save the generated value for use in later steps.
    1. You'll need this key later in your code's configuration files. This key value will not be displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.
    > :warning: For enhanced security, consider using **certificates** instead of client secrets. See: [How to use certificates instead of secrets](./README-use-certificate.md).
1. Since this app signs-in users, we will now proceed to select **delegated permissions**, which is is required by apps signing-in users.
    1. In the app's registration screen, select the **API permissions** blade in the left to open the page where we add access to the APIs that your application needs:
    1. Select the **Add a permission** button and then:
    1. Ensure that the **Microsoft APIs** tab is selected.
    1. In the *Commonly used Microsoft APIs* section, select **Microsoft Graph**
    1. In the **Delegated permissions** section, select **User.Read** in the list. Use the search box if necessary.
    1. Select the **Add permissions** button at the bottom.

##### Configure Optional Claims

1. Still on the same app registration, select the **Token configuration** blade to the left.
1. Select **Add optional claim**:
    1. Select **optional claim type**, then choose **ID**.
    1. Select the optional claim **acct**.
    > Provides user's account status in tenant. If the user is a **member** of the tenant, the value is *0*. If they're a **guest**, the value is *1*.
    1. Select **Add** to save your changes.

##### Configure the service app (msal-node-webapp) to use your app registration

Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `APP\authConfig.js` file.
1. Find the key `Enter_the_Application_Id_Here` and replace the existing value with the application ID (clientId) of `msal-node-webapp` app copied from the Azure portal.
1. Find the key `Enter_the_Tenant_Id_Here` and replace the existing value with your Azure AD tenant/directory ID.
1. Find the key `Enter_the_Client_Secret_Here` and replace the existing value with the generated secret that you saved during the creation of `msal-node-webapp` copied from the Azure portal.

1. Open the `App/app.js` file.
1. Find the string `ENTER_YOUR_SECRET_HERE` and replace it with a secret that will be used when encrypting your app's session using the [express-session](https://www.npmjs.com/package/express-session) package.

### Step 4: Running the sample

```console
    cd 5-AdvancedScenarios\1-call-graph-bff\App
    npm start
```

## Explore the sample

1. Open your browser and navigate to `http://localhost:4000`.
1. Select the **Sign In** button on the top right corner.
1. Select the **Profile** button on the navigation bar. This will make a call to the Graph API.

![Screenshot](./ReadmeFiles/screenshot.png)

> :information_source: Did the sample not work for you as expected? Then please reach out to us using the [GitHub Issues](../../../../issues) page.

## We'd love your feedback!

Were we successful in addressing your learning objective? Consider taking a moment to [share your experience with us](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUQkRCSVdRSk8wUjdZSkg2NEZGOFFaTkxQVyQlQCN0PWcu).

## Troubleshooting

<details>
	<summary>Expand for troubleshooting info</summary>

> * Use [Stack Overflow](http://stackoverflow.com/questions/tagged/msal) to get support from the community. Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Make sure that your questions or comments are tagged with [`msal-node` `node` `ms-identity` `adal` `msal-js` `msal`].

To provide feedback on or suggest features for Azure Active Directory, visit [User Voice page](https://feedback.azure.com/d365community/forum/79b1327d-d925-ec11-b6e6-000d3a4f06a4).
</details>

## About the code

### Login and logout

In [AuthProvider.js](./App/auth/AuthProvider.js), MSAL Node **ConfidentialClientApplication** is configured to obtain tokens to call downstream web APIs (here, Microsoft Graph) using OAuth 2.0 authorization code grant:

```javascript
async acquireToken(req, res, next, options) {
    const msalInstance = this.getMsalInstance();

    try {
        msalInstance.getTokenCache().deserialize(req.session.tokenCache);

        const tokenResponse = await msalInstance.acquireTokenSilent({
            account: req.session.account,
            scopes: options.scopes || [],
            claims: getClaims(req.session, this.config.msalConfig.auth.clientId),
        });

        req.session.tokenCache = msalInstance.getTokenCache().serialize();
        req.session.accessToken = tokenResponse.accessToken;
        req.session.idToken = tokenResponse.idToken;
        req.session.account = tokenResponse.account;

        return tokenResponse;
    } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
            // handle interaction error
        } else {
            throw error;
        }
    }
}
```

On the frontend side, the React SPA uses the [AuthContext](./App/client/src/context/AuthContext.js), which makes a GET call to the `/auth/login` endpoint of the Express web app.

```javascript
login = (postLoginRedirectUri) => {
    let url = "api/auth/login";

    const searchParams = new URLSearchParams({});

    if (postLoginRedirectUri) {
        searchParams.append('postLoginRedirectUri', encodeURIComponent(postLoginRedirectUri));
    }

    url = `${url}?${searchParams.toString()}`;

    window.location.replace(url);
}
```

The controller in [authController.js](./App/controllers/authController.js) processes the request and initiates a token request against Azure AD, using the [AuthProvider](./App/auth/AuthProvider.js) class which wraps MSAL Node for simplicity:

```javascript
exports.loginUser = async (req, res, next) => {
    let postLoginRedirectUri;
    let scopesToConsent;

    if (req.query && req.query.postLoginRedirectUri) {
        postLoginRedirectUri = decodeURIComponent(req.query.postLoginRedirectUri);
    }

    if (req.query && req.query.scopesToConsent) {
        scopesToConsent = decodeURIComponent(req.query.scopesToConsent);
    }

    return authProvider.login(req, res, next, { postLoginRedirectUri, scopesToConsent });
}
```

Once the authentication is successful, the authentication state can be shared with the frontend. The claims in the user's ID token is sent back to the frontend to update the UI via the `/auth/account` endpoint.

### Cookie policies

The sample makes use of HTTP only, strict cookies to secure the calls between the frontend and the backend. This is configured in [app.js](./App/app.js);

```javascript
const express = require('express');
const session = require('express-session');

const sessionConfig = {
    name: SESSION_COOKIE_NAME,
    secret: 'ENTER_YOUR_SECRET_HERE', // replace with your own secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'strict',
        httpOnly: true,
        secure: false, // set this to true on production
    },
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy e.g. App Service
    sessionConfig.cookie.secure = true; // serve secure cookies on production
}

app.use(session(sessionConfig));
```

### Handle Continuous Access Evaluation (CAE) challenge from Microsoft Graph

Continuous access evaluation (CAE) enables applications to do just-in time token validation, for instance enforcing user session revocation in the case of password change/reset but there are other benefits. For details, see [Continuous access evaluation](https://docs.microsoft.com/azure/active-directory/conditional-access/concept-continuous-access-evaluation).

Microsoft Graph is now CAE-enabled in Preview. This means that it can ask its client apps for more claims when conditional access policies require it. Your can enable your application to be ready to consume CAE-enabled APIs by:

1. Declaring that the client app is capable of handling claims challenges.
2. Processing these challenges when they are thrown by the web API

#### Declare the CAE capability in the configuration

This sample app declares that it's CAE-capable by adding the `clientCapabilities` property in the configuration in [authConfig.js](./App/authConfig.js):

```javascript
    const msalConfig = {
        auth: {
            clientId: 'Enter_the_Application_Id_Here', 
            authority: 'https://login.microsoftonline.com/Enter_the_Tenant_Info_Here',
            clientCapabilities: ["CP1"] // this lets the resource owner know that this client is capable of handling claims challenge.
        }
    }

    const msalInstance = new ConfidentialClientApplication(msalConfig);
```

#### Processing the CAE challenge from Microsoft Graph

When a CAE event occurs, the Graph service return a response with the WWW-Authenticate header and a 401 status code. You can parse this header and retrieve the claims challenge inside. Here, we set the challenge as a session variable, and a 401 status is sent to the frontend afterwards, indicating that another login request must be made. When that happens, the claims are retrieved back from the session:

```javascript
exports.getProfile = async (req, res, next) => {
    try {
        const tokenResponse = await authProvider.acquireToken(req, res, next, { scopes: ['User.Read']});
        const graphResponse = await getGraphClient(tokenResponse.accessToken).api('/me').responseType('raw').get();
        const graphData = await handleAnyClaimsChallenge(graphResponse);

        res.status(200).json(graphData);
    } catch (error) {
        if (error.name === 'ClaimsChallengeAuthError') {
            setClaims(req.session, msalConfig.auth.clientId, error.payload);
            return res.status(401).json({ error: error.name });
        }

        next(error);
    }
}

// ...

const handleAnyClaimsChallenge = async (response) => {
    if (response.status === 200) {
        return await response.json();
    }

    if (response.status === 401) {
        if (response.headers.get("WWW-Authenticate")) {
            const authenticateHeader = response.headers.get("WWW-Authenticate");
            const claimsChallenge = parseChallenges(authenticateHeader);
            const err = new Error("A claims challenge has occurred");
            err.payload = claimsChallenge.claims;
            err.name = 'ClaimsChallengeAuthError';
            throw err;
        }

        throw new Error(`Unauthorized: ${response.status}`);
    }

    throw new Error(`Something went wrong with the request: ${response.status}`);
};
```

### Access token validation

Clients should treat access tokens as opaque strings, as the contents of the token are intended for the **resource only** (such as a web API or Microsoft Graph). For validation and debugging purposes, developers can decode **JWT**s (*JSON Web Tokens*) using a site like [jwt.ms](https://jwt.ms).

For more details on what's inside the access token, clients should use the token response data that's returned with the access token to your client. When your client requests an access token, the Microsoft identity platform also returns some metadata about the access token for your app's consumption. This information includes the expiry time of the access token and the scopes for which it's valid. For more details about access tokens, please see [Microsoft identity platform access tokens](https://docs.microsoft.com/azure/active-directory/develop/access-tokens)

### Calling the Microsoft Graph API

[Microsoft Graph JavaScript SDK](https://github.com/microsoftgraph/msgraph-sdk-javascript) provides various utility methods to query the Graph API. While the SDK has a default authentication provider that can be used in basic scenarios, it can also be extended to use with a custom authentication provider such as MSAL. To do so, we will initialize the Graph SDK client with an [authProvider function](https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/dev/docs/CreatingClientInstance.md#2-create-with-options). In this case, user has to provide their own implementation for getting and refreshing accessToken. A callback will be passed into this `authProvider` function, accessToken or error needs to be passed in to that callback.

```javascript
    export const getGraphClient = (accessToken) => {
    // Initialize Graph client
    const graphClient = Client.init({
        // Use the provided access token to authenticate requests
        authProvider: (done) => {
            done(null, accessToken);
        },
    });

    return graphClient;
};
```

## Next Steps

Learn how to:

* [Sign-in users interactively server-side and silently acquire a token for MS Graph from a React single-page app](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/6-AdvancedScenarios/4-sign-in-hybrid)

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](/CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Learn More

* [Microsoft identity platform (Azure Active Directory for developers)](https://docs.microsoft.com/azure/active-directory/develop/)
* [Azure AD code samples](https://docs.microsoft.com/azure/active-directory/develop/sample-v2-code)
* [Overview of Microsoft Authentication Library (MSAL)](https://docs.microsoft.com/azure/active-directory/develop/msal-overview)
* [Register an application with the Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)
* [Configure a client application to access web APIs](https://docs.microsoft.com/azure/active-directory/develop/quickstart-configure-app-access-web-apis)
* [Understanding Azure AD application consent experiences](https://docs.microsoft.com/azure/active-directory/develop/application-consent-experience)
* [Understand user and admin consent](https://docs.microsoft.com/azure/active-directory/develop/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent)
* [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals)
* [Authentication Scenarios for Azure AD](https://docs.microsoft.com/azure/active-directory/develop/authentication-flows-app-scenarios)
* [Building Zero Trust ready apps](https://aka.ms/ztdevsession)
* [National Clouds](https://docs.microsoft.com/azure/active-directory/develop/authentication-national-cloud#app-registration-endpoints)
* [Initialize client applications using MSAL.js](https://docs.microsoft.com/azure/active-directory/develop/msal-js-initializing-client-applications)
* [Single sign-on with MSAL.js](https://docs.microsoft.com/azure/active-directory/develop/msal-js-sso)
* [Handle MSAL.js exceptions and errors](https://docs.microsoft.com/azure/active-directory/develop/msal-handling-exceptions?tabs=javascript)
* [Logging in MSAL.js applications](https://docs.microsoft.com/azure/active-directory/develop/msal-logging?tabs=javascript)
* [Pass custom state in authentication requests using MSAL.js](https://docs.microsoft.com/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request)
* [Prompt behavior in MSAL.js interactive requests](https://docs.microsoft.com/azure/active-directory/develop/msal-js-prompt-behavior)
* [Use MSAL.js to work with Azure AD B2C](https://docs.microsoft.com/azure/active-directory/develop/msal-b2c-overview)
