# Node.js & Express web app using Security Groups to implement Role-Based Access Control

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

This sample demonstrates a Node.js & Express web app that is secured with the [Microsoft Authentication Library for Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) (MSAL Node). The app implements **Role-based Access Control** (RBAC) by using Azure AD [Security Groups](https://docs.microsoft.com/microsoft-365/community/all-about-groups). In the sample, users in **TaskUser** role can perform CRUD operations on their todo list, while users in **TaskAdmin** role can see all other users' tasks.

Access control in Azure AD can be done with **App Roles** as well, as we covered in the [previous tutorial](../1-app-roles/README.md). **Security Groups** and **App Roles** in Azure AD are by no means mutually exclusive - they can be used in tandem to provide even finer grained access control.

> :information_source: Check out the recorded session on this topic: [An introduction to Microsoft Graph for developers](https://www.youtube.com/watch?v=EBbnpFdB92A)

## Scenario

1. The client application uses **MSAL Node** (via [microsoft-identity-express](https://github.com/Azure-Samples/microsoft-identity-express)) to sign-in a user and obtain an **ID Token** from **Azure AD**.
2. The **ID Token** contains the [groups claim](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-fed-group-claims) that is used to control access to protected routes.

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
    cd 4-AccessControl/2-security-groups/App
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
1. In the app's registration screen, select the **Certificates & secrets** blade in the left to open the page where you can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**:
   - Type a key description (for instance `app secret`),
   - Select one of the available key durations (**6 months**, **12 months** or **Custom**) as per your security posture.
   - The generated key value will be displayed when you select the **Add** button. Copy and save the generated value for use in later steps.
   - You'll need this key later in your code's configuration files. This key value will not be displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.
1. In the app's registration screen, select the **API permissions** blade in the left to open the page where we add access to the APIs that your application needs.
   - Select the **Add a permission** button and then,
   - Ensure that the **Microsoft APIs** tab is selected.
   - In the *Commonly used Microsoft APIs* section, select **Microsoft Graph**
   - In the **Delegated permissions** section, select the **User.Read**, **GroupMember.Read.All** in the list. Use the search box if necessary.
   - Select the **Add permissions** button at the bottom.
   - Finally, grant **admin consent** for these scopes (required to handle the [overage scenario](#the-groups-overage-claim))

#### Configure the client app (msal-node-webapp) to use your app registration

Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `App\appSettings.js` file.
1. Find the key `clientId` and replace the existing value with the application ID (clientId) of `msal-node-webapp` app copied from the Azure portal.
1. Find the key `tenantId` and replace the existing value with your Azure AD tenant ID.
1. Find the key `clientSecret` and replace the existing value with the key you saved during the creation of `msal-node-webapp` copied from the Azure portal.
1. Find the key `redirect` and replace the existing value with the redirect URI for `msal-node-webapp`. (by default `http://localhost:4000/redirect`).

1. Open the `App/app.js` file.
1. Find the string `ENTER_YOUR_SECRET_HERE` and replace it with a secret that will be used when encrypting your app's session using the [express-session](https://www.npmjs.com/package/express-session) package.

### Create Security Groups

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Azure AD** service.
1. Select **Groups** blade on the left.
1. In the **Groups** blade, select **New Group**.
    - For **Group Type**, select **Security**
    - For **Group Name**, enter **GroupAdmin**
    - For **Group Description**, enter **Admin Security Group**
    - Add **Group Owners** and **Group Members** as you see fit.
    - Select **Create**.
1. In the **Groups** blade, select **New Group**.
    - For **Group Type**, select **Security**
    - For **Group Name**, enter **GroupMember**
    - For **Group Description**, enter **User Security Group**
    - Add **Group Owners** and **Group Members** as you see fit.
    - Select **Create**.

For more information, visit: [Create a basic group and add members using Azure AD](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal)

### Configure Security Groups

You have two different options available to you on how you can further configure your application to receive the `groups` claim.

1. [Receive **all the groups** that the signed-in user is assigned to in an Azure AD tenant, included nested groups](#configure-your-application-to-receive-all-the-groups-the-signed-in-user-is-assigned-to-including-nested-groups).
2. [Receive the **groups** claim values from a **filtered set of groups** that your application is programmed to work with](#configure-your-application-to-receive-the-groups-claim-values-from-a-filtered-set-of-groups-a-user-may-be-assigned-to) (Not available in the [Azure AD Free edition](https://azure.microsoft.com/pricing/details/active-directory/)).

> To get the on-premise group's `samAccountName` or `On Premises Group Security Identifier` instead of Group ID, please refer to the document [Configure group claims for applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-fed-group-claims#prerequisites-for-using-group-attributes-synchronized-from-active-directory).

#### Configure your application to receive **all the groups** the signed-in user is assigned to, including nested groups

1. In the app's registration screen, select the **Token Configuration** blade in the left to open the page where you can configure the claims provided tokens issued to your application.
1. Select the **Add groups claim** button on top to open the **Edit Groups Claim** screen.
1. Select `Security groups` **or** the `All groups (includes distribution lists but not groups assigned to the application)` option. Choosing both negates the effect of `Security Groups` option.
1. Under the **ID** section, select `Group ID`. This will result in Azure AD sending the [object id](https://docs.microsoft.com/graph/api/resources/group?view=graph-rest-1.0) of the groups the user is assigned to in the **groups** claim of the [ID Token](https://docs.microsoft.com/azure/active-directory/develop/id-tokens) that your app receives after signing-in a user.

#### Configure your application to receive the `groups` claim values from a **filtered set of groups** a user may be assigned to

##### Prerequisites, benefits and limitations of using this option

1. This option is useful when your application is interested in a selected set of groups that a signing-in user may be assigned to and not every security group this user is assigned to in the tenant.  This option also saves your application from running into the [overage](#groups-overage-claim) issue.
1. This feature is not available in the [Azure AD Free edition](https://azure.microsoft.com/pricing/details/active-directory/).
1. **Nested group assignments** are not available when this option is utilized.

##### Steps to enable this option in your app

1. In the app's registration screen, select the **Token Configuration** blade in the left to open the page where you can configure the claims provided tokens issued to your application.
1. Select the **Add groups claim** button on top to open the **Edit Groups Claim** screen.
1. Select `Groups assigned to the application`.
    1. Choosing additional options like `Security Groups` or `All groups (includes distribution lists but not groups assigned to the application)` will negate the benefits your app derives from choosing to use this option.
1. Under the **ID** section, select `Group ID`. This will result in Azure AD sending the object [id](https://docs.microsoft.com/graph/api/resources/group?view=graph-rest-1.0) of the groups the user is assigned to in the `groups` claim of the [ID Token](https://docs.microsoft.com/azure/active-directory/develop/id-tokens) that your app receives after signing-in a user.
1. If you are exposing a Web API using the **Expose an API** option, then you can also choose the `Group ID` option under the **Access** section. This will result in Azure AD sending the [Object ID](https://docs.microsoft.com/graph/api/resources/group?view=graph-rest-1.0) of the groups the user is assigned to in the `groups` claim of the [Access Token](https://docs.microsoft.com/azure/active-directory/develop/access-tokens) issued to the client applications of your API.
1. In the app's registration screen, select on the **Overview** blade in the left to open the Application overview screen. Select the hyperlink with the name of your application in **Managed application in local directory** (note this field title can be truncated for instance `Managed application in ...`). When you select this link you will navigate to the **Enterprise Application Overview** page associated with the service principal for your application in the tenant where you created it. You can navigate back to the app registration page by using the *back* button of your browser.
1. Select the **Users and groups** blade in the left to open the page where you can assign users and groups to your application.
    1. Select the **Add user** button on the top row.
    1. Select **User and Groups** from the resultant screen.
    1. Choose the groups that you want to assign to this application.
    1. Click **Select** in the bottom to finish selecting the groups.
    1. Select **Assign** to finish the group assignment process.  
    1. Your application will now receive these selected groups in the `groups` claim when a user signing in to your app is a member of  one or more these **assigned** groups.
1. Select the **Properties** blade in the left to open the page that lists the basic properties of your application.Set the **User assignment required?** flag to **Yes**.

> :bulb: **Important security tip**
>
> When you set **User assignment required?** to **Yes**, Azure AD will check that only users assigned to your application in the **Users and groups** blade are able to sign-in to your app. You can assign users directly or by assigning security groups they belong to.

## Running the sample

```console
    cd 4-AccessControl/1-security-groups/App
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
            groups: ["Enter_the_ObjectId_of_GroupAdmin", "Enter_the_ObjectId_of_GroupMember"]
        },
        dashboard: {
            methods: ["GET"],
            groups: ["Enter_the_ObjectId_of_GroupAdmin"]
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

module.exports = app;
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
            accessRule: config.accessMatrix.todolist
        }),
        todolistRouter // users have to satisfy hasAccess middleware for all routes under /todolist
    );

    router.use('/dashboard',
        msid.isAuthenticated(),
        msid.hasAccess({
            accessRule: config.accessMatrix.dashboard
        }),
        dashboardRouter // users have to satisfy hasAccess middleware for all routes under /dashboard
    );

    return router;
}
```

Under the hood, the [hasAccess](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#hasaccess) middleware checks the signed-in user's ID token's `groups` claim to determine whether she has access to this route given the access matrix provided in [appSettings.js](./App/appSettings.js):

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

                // ...

                default:
                    break;
            }
        } else {
            res.redirect(this.appSettings.authRoutes.unauthorized);
        }
    }
}
```

### The groups overage claim

To ensure that the token size doesn’t exceed HTTP header size limits, the Microsoft Identity Platform limits the number of object Ids that it includes in the **groups** claim.

If a user is member of more groups than the overage limit (**150 for SAML tokens, 200 for JWT tokens, 6 for single-page applications**), then the Microsoft identity platform does not emit the group IDs in the `groups` claim in the token. Instead, it includes an **overage** claim in the token that indicates to the application to query the [MS Graph API](https://graph.microsoft.com) to retrieve the user’s group membership.

> We strongly advise you use the [group filtering feature](#configure-your-application-to-receive-the-groups-claim-values-from-a-filtered-set-of-groups-a-user-may-be-assigned-to) (if possible) to avoid running into group overages.

#### Create the overage scenario for testing

1. You can use the `BulkCreateGroups.ps1` provided in the [App Creation Scripts](./AppCreationScripts/) folder to create a large number of groups and assign users to them. This will help test overage scenarios during development. **Remember to change** the user's **objectId** provided in the `BulkCreateGroups.ps1` script.

When attending to overage scenarios, which requires a call to [Microsoft Graph](https://graph.microsoft.com) to read the signed-in user's group memberships, your app will need to have the [User.Read](https://docs.microsoft.com/graph/permissions-reference#user-permissions) and [GroupMember.Read.All](https://docs.microsoft.com/graph/permissions-reference#group-permissions) for the [getMemberGroups](https://docs.microsoft.com/graph/api/user-getmembergroups) function to execute successfully.

> :warning: For the overage scenario, make sure you have granted **Admin Consent** for the MS Graph API's **GroupMember.Read.All** scope (see the **App Registration** steps above).

#### Handle the overage scenario

When the overage occurs, the user's ID token will have the `_claim_names` and `_claim_sources` claims instead of the `groups` claim. Furthermore, `_claim_sources` claim contains the URL that we can query to get the full list of groups the user belongs to. In the [hasAccess()](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#hasaccess) middleware we detect if the overage, and trigger the [handleOverage](https://azure-samples.github.io/microsoft-identity-express/classes/msalwebappauthclient.html#handleoverage) method to query the URL we mentioned.

```typescript
async handleOverage(req: Request, res: Response, next: NextFunction, rule: AccessRule): Promise<void> {
    const { _claim_names, _claim_sources, ...newIdTokenClaims } = <IdTokenClaims>req.session.account.idTokenClaims;

    const silentRequest: SilentFlowRequest = {
        account: req.session.account,
        scopes: AccessControlConstants.GRAPH_MEMBER_SCOPES.split(" "),
    };

    try {
        // acquire token silently to be used in resource call
        const tokenResponse = await this.msalClient.acquireTokenSilent(silentRequest);
        try {
            const graphResponse = await FetchManager.callApiEndpointWithToken(AccessControlConstants.GRAPH_MEMBERS_ENDPOINT, tokenResponse.accessToken);

            /**
             * Some queries against Microsoft Graph return multiple pages of data either due to server-side paging 
             * or due to the use of the $top query parameter to specifically limit the page size in a request. 
             * When a result set spans multiple pages, Microsoft Graph returns an @odata.nextLink property in 
             * the response that contains a URL to the next page of results. Learn more at https://docs.microsoft.com/graph/paging
             */
            if (graphResponse[AccessControlConstants.PAGINATION_LINK]) {
                try {
                    const userGroups = await FetchManager.handlePagination(tokenResponse.accessToken, graphResponse[AccessControlConstants.PAGINATION_LINK]);

                    req.session.account.idTokenClaims = {
                        ...newIdTokenClaims,
                        groups: userGroups
                    }

                    if (!this.checkAccessRule(req.method, rule, req.session.account.idTokenClaims[AccessControlConstants.GROUPS], AccessControlConstants.GROUPS)) {
                        return res.redirect(this.appSettings.authRoutes.unauthorized);
                    } else {
                        return next();
                    }
                } catch (error) {
                    next(error);
                }
            } else {
                req.session.account.idTokenClaims = {
                    ...newIdTokenClaims,
                    groups: graphResponse["value"].map((v) => v.id)
                }

                if (!this.checkAccessRule(req.method, rule, req.session.account.idTokenClaims[AccessControlConstants.GROUPS], AccessControlConstants.GROUPS)) {
                    return res.redirect(this.appSettings.authRoutes.unauthorized);
                } else {
                    return next();
                }
            }
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
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