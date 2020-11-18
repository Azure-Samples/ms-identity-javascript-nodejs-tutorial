---
page_type: sample
languages:
  - csharp
  - javascript
  - typescript
  - python
  - java
products:
  - node.js  
  - azure-active-directory-b2c
  - microsoft-identity-platform
name: A Node.js & Express Web App calling a custom web API on Azure AD B2C using MSAL Node
urlFragment: ms-identity-javascript-nodejs-tutorial
description: "This sample demonstrates a Node.js & Express Web App application calling a Node.js & Express Web API that is secured using Azure AD B2C"
---
# A Node.js & Express Web App calling a custom web API on Azure AD B2C using MSAL Node

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

This sample demonstrates a Node.js & Express Web App application calling a Node.js & Express Web API that is secured using Azure AD B2C.

## Scenario

1. The client Node.js & Express Web App application uses MSAL Node to sign-in and obtain a JWT access token from **Azure AD B2C**.
2. The access token is used as a bearer token to authorize the user to call the Node.js & Express Web API protected  **Azure AD B2C**.

![Overview](./ReadmeFiles/topology.png)

## Contents

| File/folder           | Description                                                   |
|-----------------------|---------------------------------------------------------------|
| `AppCreationScripts/` | Contains Powershell scripts to automate app registration.     |
| `ReadmeFiles/`        | List of changes to the sample.                                |
| `WebApp/`                | Express application source folder.                            |
| `WebAPI/`                | Express application source folder.                            |

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) must be installed to run this sample.
- A modern web browser. This sample uses **ES6** conventions and will not run on **Internet Explorer**.
- [Visual Studio Code](https://code.visualstudio.com/download) is recommended for running and editing this sample.
- [VS Code Azure Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension is recommended for interacting with Azure through VS Code Interface.
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

```console
    cd ExpressWebApi-c3s2
    npm install
```

```console
    cd ExpressWebApp-c3s2
    npm install
```

### Register the sample application(s) with your Azure Active Directory tenant

:warning: This sample comes with a pre-registered application for testing purposes. If you would like to use your own **Azure AD B2C** tenant and application, follow the steps below to register and configure the application in the **Azure portal**. Otherwise, continue with the steps for [Running the sample](#running-the-sample).

### Choose the Azure AD tenant where you want to create your applications

As a first step you'll need to:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Azure AD B2C tenant, select your profile at the top right corner in the menu on top of the page, and then **switch directory** to change your portal session to the desired Azure AD B2C tenant.

### Create User Flows and Custom Policies

Please refer to: [Tutorial: Create user flows in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows)

### Add External Identity Providers

Please refer to: [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-add-identity-providers)

### Register the Service app (ExpressWebApi-c3s2)

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Azure AD B2C** service.
1. Select the **App Registrations** blade on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `ExpressWebApi-c3s2`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file(s) later in your code.
1. Select **Save** to save your changes.
1. In the app's registration screen, select the **Expose an API** blade to the left to open the page where you can declare the parameters to expose this app as an Api for which client applications can obtain [access tokens](https://docs.microsoft.com/azure/active-directory/develop/access-tokens) for.
The first thing that we need to do is to declare the unique [resource](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow) URI that the clients will be using to obtain access tokens for this Api. To declare an resource URI, follow the following steps:
   - Select `Set` next to the **Application ID URI** to generate a URI that is unique for this app.
   - For this sample, accept the proposed Application ID URI (api://{clientId}) by selecting **Save**.
1. All Apis have to publish a minimum of one [scope](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow#request-an-authorization-code) for the client's to obtain an access token successfully. To publish a scope, follow the following steps:
   - Select **Add a scope** button open the **Add a scope** screen and Enter the values as indicated below:
        - For **Scope name**, use `access_as_user`.
        - Select **Admins and users** options for **Who can consent?**
        - For **Admin consent display name** type `Access ExpressWebApi-c3s2`
        - For **Admin consent description** type `Allows the app to access ExpressWebApi-c3s2 as the signed-in user.`
        - For **User consent display name** type `Access ExpressWebApi-c3s2`
        - For **User consent description** type `Allow the application to access ExpressWebApi-c3s2 on your behalf.`
        - Keep **State** as **Enabled**
        - Select the **Add scope** button on the bottom to save this scope.

#### Configure the Service app (ExpressWebApi-c3s2) to use your app registration

Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `WebAPI\auth.json` file.
1. Find the key `clientId` and replace the existing value with the application ID (clientId) of the `ExpressWebApi-c3s2` application copied from the Azure portal.
1. Find the key `tenantId` and replace the existing value with your Azure AD tenant ID.

1. Open the `auth.json` file.
1. Find the key `ClientId` and replace the existing value with the application ID (clientId) of the application copied from **Azure Portal**.
1. Find the key `TenantId` and replace the existing value with your Azure AD tenant ID (or tenant name) copied from **Azure Portal**.
1. Find the key `ClientSecret` and replace the existing value with the key you saved during the creation of the application, on **Azure Portal**.
1. Find the key `homePageRoute` and replace the existing value with the home page route of your application, e.g. `/home`.
1. Find the key `redirectUri` and replace the existing value with the redirect URI that you have registered on **Azure Portal**, e.g. `http://localhost:4000/redirect`.
1. Find the key `postLogoutRedirectUri` and replace the existing value with the URI of the page that you wish to be redirected after signing-out, e.g `http://localhost:4000/`.
1. Find the key `policies.names` and replace it with the names (IDs) of your policies/user-flows, e.g. `b2c_1_susi`.
1. Find the key `policies.authorities` abd replace it with the authority strings of your policies/user-flows, e.g. `https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_susi`.
1. Find the key `policies.authorityDomain` abd replace it with the domain of your authority, e.g. `fabrikamb2c.b2clogin.com`.
1. 
<!-- ENTER CONFIGURATION STEPS FOR B2C USER-FLOWS/CUSTOM POLICIES BELOW -->

### Register the Client app (ExpressWebApp-c3s2)

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Azure AD B2C** service.
1. Select the **App Registrations** blade on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `ExpressWebApp-c3s2`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:4000/redirect`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file(s) later in your code.
1. Select **Save** to save your changes.
1. In the app's registration screen, select the **Certificates & secrets** blade in the left to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**:
   - Type a key description (for instance `app secret`),
   - Select one of the available key durations (**In 1 year**, **In 2 years**, or **Never Expires**) as per your security posture.
   - The generated key value will be displayed when you select the **Add** button. Copy the generated value for use in the steps later.
   - You'll need this key later in your code's configuration files. This key value will not be displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.
1. In the app's registration screen, select the **API permissions** blade in the left to open the page where we add access to the APIs that your application needs.
   - Select the **Add a permission** button and then,
   - Ensure that the **My APIs** tab is selected.
   - In the list of APIs, select the API `ExpressWebApi-c3s2`.
   - In the **Delegated permissions** section, select the **Access 'ExpressWebApi-c3s2'** in the list. Use the search box if necessary.
   - Select the **Add permissions** button at the bottom.

#### Configure the Client app (ExpressWebApp-c3s2) to use your app registration

Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `WebApp\auth.json` file.
1. Find the key `clientId` and replace the existing value with the application ID (clientId) of the `ExpressWebApp-c3s2` application copied from the Azure portal.

<!-- ENTER CONFIGURATION STEPS FOR B2C USER-FLOWS/CUSTOM POLICIES BELOW -->

1. Find the key `tenantId` and replace the existing value with your Azure AD tenant ID.

<!-- ENTER CONFIGURATION STEPS FOR B2C USER-FLOWS/CUSTOM POLICIES BELOW -->

1. Find the key `clientSecret` and replace the existing value with the key you saved during the creation of the `ExpressWebApp-c3s2` app, in the Azure portal.

<!-- ENTER CONFIGURATION STEPS FOR B2C USER-FLOWS/CUSTOM POLICIES BELOW -->

1. Find the key `redirectUri` and replace the existing value with the Redirect URI for ExpressWebApp-c3s2 app. For example, 'http://localhost:4000/' .

<!-- ENTER CONFIGURATION STEPS FOR B2C USER-FLOWS/CUSTOM POLICIES BELOW -->

1. Find the key `postLogoutRedirectUri` and replace the existing value with the base address of the ExpressWebApp-c3s2 project (by default `http://localhost:4000/`).

<!-- ENTER CONFIGURATION STEPS FOR B2C USER-FLOWS/CUSTOM POLICIES BELOW -->


## Running the sample

```console
    cd ExpressWebApi-c3s2
    npm start
```

```console
    cd ExpressWebApp-c3s2
    npm start
```

## Explore the sample

1. Open your browser and navigate to `http://localhost:4000`.
1. Click the **Sign-in** button on the top right corner.
1. Once you sign-in, click on the **Call web API**.

![Screenshot](./ReadmeFiles/screenshot.png)

> :information_source: Did the sample not work for you as expected? Then please reach out to us using the [GitHub Issues](../../../../issues) page.

## We'd love your feedback!

Were we successful in addressing your learning objective? [Do consider taking a moment to share your experience with us.](Enter_Survey_Form_Link)

## About the code

### Configuration

### Protected resources

### Access Token validation

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

If you find a bug in the sample, raise the issue on [GitHub Issues](../../issues).

To provide feedback on or suggest features for Azure Active Directory, visit [User Voice page](https://feedback.azure.com/forums/169401-azure-active-directory).

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](/CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.