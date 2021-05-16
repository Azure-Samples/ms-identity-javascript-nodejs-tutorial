# Deploy your apps to Azure Cloud using App Service and Key Vault

 1. [Overview](#overview)
 1. [Scenario](#scenario)
 1. [Prerequisites](#prerequisites)
 1. [Setup](#setup)
 1. [Registration](#registration)
 1. [Deployment](#deployment)
 1. [Explore the sample](#explore-the-sample)
 1. [More information](#more-information)
 1. [Community Help and Support](#community-help-and-support)
 1. [Contributing](#contributing)

## Overview

This sample demonstrates how to deploy a Node.js & Express web application coupled with a Node.js & Express web API to **Azure Cloud** using the [Azure App Service](https://docs.microsoft.com/azure/app-service/). To do so, we will use the [same code sample from Chapter 3](../3-Authorization-II/1-call-api). One of the principles of security is to place credentials like secrets and certificates out of your code and use it in a manner that allows them to be replaced or rotated without incurring a downtime. To do this, we will make use of the [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/general/about-keys-secrets-certificates) to store client secrets.

> :information_source: The steps below apply similarly to B2C applications, for instance the [B2C sample from Chapter 3](../3-Authorization-II/2-call-api-b2c)

## Scenario

1. The client application uses the **MSAL Node** library to sign-in a user and obtain a JWT **Access Token** from **Azure AD**.
1. The **Access Token** is used as a **bearer** token to *authorize* the user to call the protected web API.
1. The protected web API responds with the claims in the **Access Token**.

![Overview](./ReadmeFiles/topology_dep.png)

## Prerequisites

- [VS Code Azure Tools Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension is recommended for interacting with **Azure** through VS Code interface.
- An **Azure AD** tenant. For more information, see: [How to get an Azure AD tenant](https://azure.microsoft.com/documentation/articles/active-directory-howto-tenant/)
- A user account in your **Azure AD** tenant.
- An **Azure subscription**. This sample uses **Azure App Service** and **Azure Key Vault**.

## Setup

Locate the root of the [sample folder](../3-Authorization-II/1-call-api). Then:

```console
    cd WebAPI
    npm install
    cd ../
    cd WebApp
    npm install
```

## Registration

### Register the web API

Use the same app registration credentials that you've obtained during [**chapter 3-1**](../3-Authorization-II/3-1-call-api). You may copy-paste the contents of your `config.json` file to do so.

### Register the web app

Use the same app registration credentials that you've obtained during [**chapter 3-1**](../3-Authorization-II/3-1-call-api). You may copy-paste the contents of your `appSettings.json` file to do so.

## Deployment

There are basically **3** stages that you will have to go through in order to deploy your projects and enable authentication:

1. Upload your project files to **Azure** services and obtain published website URIs
1. Update **Azure AD** **App Registration** with URIs you have just obtained
1. Update your configuration files with URIs you have just obtained

There are various ways to upload your files to **Azure App Service**. Here we provide steps for uploading via **VS Code Azure Tools Extension**.

> We recommend watching the [video tutorial](https://docs.microsoft.com/azure/developer/javascript/tutorial-vscode-azure-app-service-node-01) offered by Microsoft Docs for preparation.

### Deploy the web API

#### Step 1: Deploy your files

1. In the **VS Code** activity bar, select the **Azure** logo to show the **Azure App Service** explorer. Select **Sign in to Azure...** and follow the instructions. Once signed in, the explorer should show the name of your **Azure** subscription(s).

![api_step1](./ReadmeFiles/api_step1.png)

2. On the **App Service** explorer section you will see an upward-facing arrow icon. Click on it publish your local files in the `WebAPI` folder to **Azure App Services**.

![api_step2](./ReadmeFiles/api_step2.png)

3. Choose a creation option based on the operating system to which you want to deploy. in this sample, we choose **Linux**.
4. Select a Node.js version when prompted. An **LTS** version is recommended.
5. Type a globally unique name for your web API and press Enter. The name must be unique across all of **Azure**. (e.g. `msal-nodejs-webapi1`)
6. After you respond to all the prompts, **VS Code** shows the **Azure** resources that are being created for your app in its notification popup.
7. Select **Yes** when prompted to update your configuration to run npm install on the target Linux server.

![api_step3](./ReadmeFiles/api_step3.png)

#### Step 2: Disable default authentication

Now you need to navigate to the **Azure App Service** Portal, and locate your project there. Once you do, click on the **Authentication/Authorization** blade. There, make sure that the **App Services Authentication** is switched off (and nothing else is checked), as we are using our own **custom** authentication logic.

![disable_easy_auth](./ReadmeFiles/disable_easy_auth.png)

### Deploy the web app

> :information_source: The steps below are the same with deploying your web API, except for step 3 where we reconfigure `appSettings.json` for the web app.

#### Step 1: Deploy your files

1. In the **VS Code** activity bar, select the **Azure** logo to show the **Azure App Service** explorer. Select **Sign in to Azure...** and follow the instructions. Once signed in, the explorer should show the name of your **Azure** subscription(s).
2. On the **App Service** explorer section you will see an upward-facing arrow icon. Click on it publish your local files in the `WebApp` folder to **Azure App Services** (use "Browse" option if needed, and locate the right folder).
3. Choose a creation option based on the operating system to which you want to deploy. in this sample, we choose **Linux**.
4. Select a Node.js version when prompted. An **LTS** version is recommended.
5. Type a globally unique name for your web app and press Enter. The name must be unique across all of **Azure**. (e.g. `msal-nodejs-webapp1`)
6. After you respond to all the prompts, **VS Code** shows the **Azure** resources that are being created for your app in its notification popup.
7. Select **Yes** when prompted to update your configuration to run npm install on the target Linux server.

#### Step 2: Disable default authentication

Now you need to navigate to the **Azure App Service** Portal, and locate your project there. Once you do, click on the **Authentication/Authorization** blade. There, make sure that the **App Services Authentication** is switched off (and nothing else is checked), as we are using our own **custom** authentication logic.

#### Step 3: Update your authentication configuration

Now we need to obtain authentication parameters. There are 2 things to do:

- Update Azure AD (or Azure AD B2C) **App Registration**
- Update the deployed `appSettings.json` file.

First, navigate to the [Azure portal](https://portal.azure.com) and select the **Azure AD** service.

1. Select the **App Registrations** blade on the left, then find and select the web app that you have registered in the previous tutorial (`msal-node-webapp`).
1. Navigate to the **Authentication** blade. There, in **Redirect URI** section, enter the following redirect URI: `https://msal-node-webapp1.azurewebsites.net/redirect`.
1. Select **Save** to save your changes.

#### Step 4: Update the web app's configuration file

Now you need to update your authentication configuration file. To do so, go to your **Azure App Service** explorer via **VS Code** Azure panel. There, click on your project's name > **Files** > **appSettings.json** as shown below:

![deployed_config](./ReadmeFiles/deployed_config.png)

1. Find the key `redirectUri` and replace the existing value with the Redirect URI for `msal-node-webapp` app. For example, `https://msal-node-webapp1.azurewebsites.net/redirect`.
1. Find the key `postLogoutRedirectUri` and replace the existing value with the base address of the `msal-node-webapp` project (by default `https://msal-node-webapp1.azurewebsites.net/`).
1. Find the key `resources.webAPI.endpoint` and replace the existing value with your deployed web API's URI and endpoint, e.g. `https://msal-node-webapi1.azurewebsites.net/api`.

### Enable your web app to get secrets from Key Vault using Managed Identity

To achieve this we'll place our application's credentials in [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) and access it via [managed Identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

#### Set up your Managed Identity

1. Navigate to [Azure portal](https://portal.azure.com) and select the **Azure App Service**.
1. Find and select the App Service you've created previously.
1. On App Service portal, select **Identity**.
1. Within the **System assigned** tab, switch **Status** to **On**. Click **Save**.
1. Record the **Object Id** that will appear, as you will need it in the next step.

For more information, see [Add a system-assigned identity](https://docs.microsoft.com/azure/app-service/overview-managed-identity?tabs=dotnet#add-a-system-assigned-identity)

#### Set up your Key vault

Before starting here, make sure:

- You have an [Azure Subscription](https://azure.microsoft.com/free/).
- You have a working and deployed application as an Azure App Service following the steps listed at [Deploy the web app](#deploy-the-web-app) above.
- Follow the guide to [create an Azure Key Vault](https://docs.microsoft.com/azure/key-vault/general/quick-create-portal).

##### Upload your secret to KeyVault

1. Navigate to your new key vault in the Azure portal.
1. On the Key Vault settings pages, select **Secrets**.
1. Click on **Generate/Import**.
1. On the **Create a secret** screen choose the following values:
    - **Upload options**: Manual.
    - **Name**: Type a name for the secret. The secret name must be unique within a Key Vault. For example, `ExampleSecret`
    - **Value**: Copy and paste the value for the `clientSecret` property (without quotes!) from your `appSettings.json` file.
    - Leave the other values to their defaults. Click **Create**.

##### Provide the managed identity access to Key Vault

1. Navigate to your Key Vault in the portal.
1. Select **Overview** > **Access policies**.
1. Click on **Add Access Policy**.
1. In the input box for **Secret permissions**, select **Get**.
1. Click on **Select Principal**, add the **system-assigned managed identity** that you have created in the [steps before](#set-up-your-managed-identity). You can use the **Object Id** you have recorded previously to search for it.
1. Click on **OK** to add the new Access Policy, then click **Save** to save the Access Policy.

#### Add environment variables to App Service

Finally, you need to add a few environment variables to the App Service where you deployed your web app.

1. In the [Azure portal](https://portal.azure.com) , search for and select **App Service**, and then select your app.
1. Select **Configuration** blade on the left, then select **New Application Settings**.
1. Add the following variables (name-value):
    1. **KEY_VAULT_NAME**: the name of the key vault you've created, e.g. `node-test-vault`
    1. **SECRET_NAME**: the name of the certificate you specified when importing it to key vault, e.g. `ExampleSecret`

Wait for a few minutes for your changes on **App Service** to take effect. You should then be able to visit your published website and sign-in accordingly.

## Explore the sample

1. Open your browser and navigate to your deployed client app's URI, for instance: `https://msal-node-webapp1.azurewebsites.net/`.
1. Click on the **sign-in** button located on the top right corner.
1. Once you authenticate, click on the **Call web API** button at the center.

![Screenshot](./ReadmeFiles/screenshot.png)

## We'd love your feedback!

Were we successful in addressing your learning objective? Consider taking a moment to [share your experience with us](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUQkRCSVdRSk8wUjdZSkg2NEZGOFFaTkxQVyQlQCN0PWcu).

## About the code

### Accessing Key Vault using Managed Identity

In [router.js](./WebApp/App/routes/router.js), we use the [@azure/identity](https://www.npmjs.com/package/@azure/identity) to access the environment credentials via Managed Identity, and then the [@azure/keyvault-secrets](https://www.npmjs.com/package/@azure/keyvault-secrets) to access the Key Vault and grab the secret. Then we initialize the wrapper with the secret from Key Vault:

```javascript
const identity = require("@azure/identity");
const keyvaultSecret = require('@azure/keyvault-secrets');
const msalWrapper = require('msal-express-wrapper');

const config = require('../../appSettings.json');
const cache = require('../utils/cachePlugin');

// initialize router
const router = express.Router();

// Importing from key vault
const keyVaultName = process.env["KEY_VAULT_NAME"];
const KVUri = "https://" + keyVaultName + ".vault.azure.net";
const secretName = process.env["SECRET_NAME"];

// Using the deployment environment as credential provider
const credential = new identity.ManagedIdentityCredential();

// Initialize secretClient with credentials
const secretClient = new keyvaultSecret.SecretClient(KVUri, credential);

secretClient.getSecret(secretName).then((secretResponse) => {

    // assing the secret obtained from Key Vault
    config.credentials.clientSecret = secretResponse.value;

    // initialize wrapper
    const authProvider = new msalWrapper.AuthProvider(config, cache);

    router.get('/signin', authProvider.signIn);
    router.get('/signout', authProvider.signOut);
    router.get('/redirect', authProvider.handleRedirect);
    
    // other app routes...

}).catch(err => console.log(err));
```

## More information

- [Azure App Services](https://docs.microsoft.com/azure/app-service/)
- [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/general/about-keys-secrets-certificates)
- [Azure Managed Identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD](https://docs.microsoft.com/azure/active-directory/develop/authentication-flows-app-scenarios).

## Community Help and Support

Use [Stack Overflow](http://stackoverflow.com/questions/tagged/msal) to get support from the community.
Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Make sure that your questions or comments are tagged with [`azure-ad` `azure-ad-b2c` `ms-identity` `msal`].

If you find a bug in the sample, please raise the issue on [GitHub Issues](../../../../issues).

To provide a recommendation, visit the following [User Voice page](https://feedback.azure.com/forums/169401-azure-active-directory).

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](../../CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
