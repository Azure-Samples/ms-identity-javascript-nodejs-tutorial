# A Node.js & Express web app using App Roles to implement Role-Based Access Control

- [Overview](#overview)
- [Scenario](#scenario)
- [Contents](#contents)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Registration](#registration)
- [Running the sample](#running-the-sample)
- [Explore the sample](#explore-the-sample)
- [About the code](#about-the-code)
- [More information](#more-information)
- [Community Help and Support](#community-help-and-support)
- [Contributing](#contributing)

## Overview

This sample demonstrates a Node.js & Express web app that is secured with the [Microsoft Authentication Library for Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) (MSAL Node). The app implements **Role-based Access Control** (RBAC) by using Azure AD [App Roles](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps). In the sample, users in **TaskUser** role can perform CRUD operations on their todo list, while users in **TaskAdmin** role can see all other users' tasks.

Access control in Azure AD can be done with **Security Groups** as well, as we will cover in the [next tutorial](../2-security-groups/README.md). **Security Groups** and **App Roles** in Azure AD are by no means mutually exclusive - they can be used in tandem to provide even finer grained access control.

> :information_source: Check out the recorded session on this topic: [Implement Authorization in your Applications with Microsoft identity platform](https://www.youtube.com/watch?v=LRoc-na27l0)

## Scenario

1. The client application uses **MSAL Node** (via [microsoft-identity-express](https://github.com/Azure-Samples/microsoft-identity-express)) to sign-in a user and obtain an **ID Token** from **Azure AD**.
2. The **ID Token** contains the [roles claim](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps#declare-roles-for-an-application) that is used to control access to protected routes.

![Overview](./ReadmeFiles/topology.png)

## Contents

| File/folder                 | Description                                                   |
|-----------------------------|---------------------------------------------------------------|
| `AppCreationScripts/`       | Contains Powershell scripts to automate app registration.     |
| `ReadmeFiles/`              | Contains illustrations and screenshots.                       |
| `App/appSettings.js`      | Authentication parameters and settings.                       |
| `App/data/db.json`          | Stores todo list data.                                        |
| `App/app.js`                | Application entry point.                                      |

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

```console
    cd 4-AccessControl/1-app-roles/App
    npm install
```

### Registration

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
1. In the **Client secrets** section, select **New client secret**:
   - Type a key description (for instance `app secret`),
   - Select one of the available key durations (**6 months**, **12 months** or **Custom**) as per your security posture.
   - The generated key value will be displayed when you select the **Add** button. Copy and save the generated value for use in later steps.
   - You'll need this key later in your code's configuration files. This key value will not be displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.

### Define Application Roles

1. Still on the same app registration, select the **App roles** blade to the left.
1. Select **Create app role**:
    - For **Display name**, enter a suitable name, for instance **TaskAdmin**.
    - For **Allowed member types**, choose **User**.
    - For **Value**, enter **TaskAdmin**.
    - For **Description**, enter **Admins can read any user's todo list**.
1. Select **Create app role**:
    - For **Display name**, enter a suitable name, for instance **TaskUser**.
    - For **Allowed member types**, choose **User**.
    - For **Value**, enter **TaskUser**.
    - For **Description**, enter **Users can read and modify their todo lists**.
1. Select **Apply** to save your changes.

To add users to this app role, follow the guidelines here: [Assign users and groups to roles](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps#assign-users-and-groups-to-roles).

> :bulb: **Important security tip**
>
> When you set **User assignment required?** to **Yes**, Azure AD will check that only users assigned to your application in the **Users and groups** blade are able to sign-in to your app. You can assign users directly or by assigning security groups they belong to.

#### Configure the client app (msal-node-webapp) to use your app registration

Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `App\appSettings.json` file.
1. Find the key `clientId` and replace the existing value with the application ID (clientId) of `msal-node-webapp` app copied from the Azure portal.
1. Find the key `tenantId` and replace the existing value with your Azure AD tenant ID.
1. Find the key `clientSecret` and replace the existing value with the key you saved during the creation of `msal-node-webapp` copied from the Azure portal.
1. Find the key `redirect` and replace the existing value with the **redirect URI** for `msal-node-webapp`. (by default `http://localhost:4000/redirect`).

1. Open the `App/app.js` file.
1. Find the string `ENTER_YOUR_SECRET_HERE` and replace it with a secret that will be used when encrypting your app's session using the [express-session](https://www.npmjs.com/package/express-session) package.

## Running the sample

```console
    cd 4-AccessControl/1-app-roles/App
    npm start
```

## Explore the sample

1. Open your browser and navigate to `http://localhost:4000`.
1. Sign-in using the button on top-right.
1. Click on the **TodoList** button to access your (the signed-in user's) todo list.
1. If the signed-in user has the right privileges (i.e. in the right "role"), click on the **Dashboard** button to access every users' todo list.
1. If the signed-in user does not have the right privileges, clicking on the **Dashboard** will give an error.

> :information_source: Did the sample not work for you as expected? Then please reach out to us using the [GitHub Issues](../../../../issues) page.

## We'd love your feedback!

Were we successful in addressing your learning objective? Consider taking a moment to [share your experience with us](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUQkRCSVdRSk8wUjdZSkg2NEZGOFFaTkxQVyQlQCN0PWcu).

## About the code

### Implementing role-based access control

In [appSettings.js](./App/appSettings.js), we create an access matrix that defines the required roles and allowed HTTP methods for each route that we like to grant role-based access:

```js
{
    accessMatrix: {
        todolist: {
            methods: ["GET", "POST", "DELETE"],
            groups: ["TaskAdmin", "TaskUser"]
        },
        dashboard: {
            methods: ["GET"],
            groups: ["TaskAdmin"]
        }
    }
}
```

Then, in [app.js](./App/app.js), we create an instance of the [MsalWebAppAuthClient](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html) class.

```javascript
const express = require('express');
const session = require('express-session');
const MsIdExpress = require('microsoft-identity-express');

const appSettings = require('./appSettings.js');
const mainRouter = require('./routes/mainRoutes');

const SERVER_PORT = process.env.PORT || 4000;

// initialize express
const app = express(); 

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

// pass the instance to your routers
app.use(mainRouter(msid));

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
```

The `msid` object exposes the middleware we can use to protect our app routes. This can be seen in [mainRoutes.js](./App/routes/mainRoutes.js):

```javascript
const express = require('express');

module.exports = (msid) => {

    // initialize router
    const router = express.Router();

    // app routes
    router.get('/', (req, res, next) => res.redirect('/home'));
    router.get('/home', mainController.getHomePage);

    // authentication routes
    router.get('/signin', msid.signIn({ postLoginRedirect: '/' }));
    router.get('/signout', msid.signOut({ postLogoutRedirect: '/' }));

    // secure routes
    router.get('/id', msid.isAuthenticated(), mainController.getIdPage);

    router.use('/todolist',
        msid.isAuthenticated(),
        msid.hasAccess({
            accessRule: appSettings.accessMatrix.todolist
        }),
        todolistRouter
    );

    router.use('/dashboard',
        msid.isAuthenticated(),
        msid.hasAccess({
            accessRule: appSettings.accessMatrix.dashboard
        }),
        dashboardRouter
    );

    return router;
}
```

Under the hood, the wrapper's [hasAccess()](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#hasaccess) middleware checks the signed-in user's ID token's `roles` claim to determine whether she has access to this route given the access matrix provided in [appSettings.js](./App/appSettings.js):

```typescript
hasAccess(options?: GuardOptions): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (req.session && this.appSettings.accessMatrix) {

            const checkFor = options.accessRule.hasOwnProperty(AccessControlConstants.GROUPS) ? AccessControlConstants.GROUPS : AccessControlConstants.ROLES;

            switch (checkFor) {
                case AccessControlConstants.GROUPS:

                    if (req.session.account.idTokenClaims[AccessControlConstants.GROUPS] === undefined) {
                        if (req.session.account.idTokenClaims[AccessControlConstants.CLAIM_NAMES]
                            || req.session.account.idTokenClaims[AccessControlConstants.CLAIM_SOURCES]) {
                            this.logger.warning(InfoMessages.OVERAGE_OCCURRED);
                            return await this.handleOverage(req, res, next, options.accessRule);
                        } else {
                            this.logger.error(ErrorMessages.USER_HAS_NO_GROUP);
                            return res.redirect(this.appSettings.authRoutes.unauthorized);
                        }
                    } else {
                        const groups = req.session.account.idTokenClaims[AccessControlConstants.GROUPS];

                        if (!this.checkAccessRule(req.method, options.accessRule, groups, AccessControlConstants.GROUPS)) {
                            return res.redirect(this.appSettings.authRoutes.unauthorized);
                        }
                    }

                    next();
                    break;

                case AccessControlConstants.ROLES:
                    if (req.session.account.idTokenClaims[AccessControlConstants.ROLES] === undefined) {
                        this.logger.error(ErrorMessages.USER_HAS_NO_ROLE);
                        return res.redirect(this.appSettings.authRoutes.unauthorized);
                    } else {
                        const roles = req.session.account.idTokenClaims[AccessControlConstants.ROLES];

                        if (!this.checkAccessRule(req.method, options.accessRule, roles, AccessControlConstants.ROLES)) {
                            return res.redirect(this.appSettings.authRoutes.unauthorized);
                        }
                    }

                    next();
                    break;

                default:
                    break;
            }
        } else {
            res.redirect(this.appSettings.authRoutes.unauthorized);
        }
    }
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
Make sure that your questions or comments are tagged with [`azure-active-directory` `nodejs` `ms-identity` `adal` `msal`].

If you find a bug in the sample, raise the issue on [GitHub Issues](../../../../issues).

To provide feedback on or suggest features for Azure Active Directory, visit [User Voice page](https://feedback.azure.com/forums/169401-azure-active-directory).

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](/CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.