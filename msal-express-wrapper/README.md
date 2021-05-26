# MSAL Express Wrapper

This project illustrates a simple wrapper around **MSAL Node** to handle login, logout, and token acquisition. The wrapper is implemented in **TypeScript** and located under the `src/` folder. The wrapper handles authentication with both **Azure AD** and **Azure AD B2C**.

## Usage

1. Start by installing the wrapper:

```console
  npm install
```

2. Once installed, build the project:

```console
  npm run build
```

3. Then, initialize the wrapper in your app by providing a settings file in JSON. The file looks like the following:

    ```JSON
    {
        "credentials": {
            "clientId": "CLIENT_ID",
            "tenantId": "TENANT_ID",
            "clientSecret": "CLIENT_SECRET"
        },
        "settings": {
            "homePageRoute": "/home",
            "redirectUri": "http://localhost:4000/redirect",
            "postLogoutRedirectUri": "http://localhost:4000"
        }
    }
    ```

> :information_source: For `redirectUri` and `postLogoutRedirectUri`, you can simply enter the path component of the URI instead of the full URI. This may come in handy in deployment scenarios.

4. Add the web API endpoints you would like to call under **resources**:

    ```JSON
    {
        // ...
        "resources": {
            "graphAPI": {
                "callingPageRoute": "/profile",
                "endpoint": "https://graph.microsoft.com/v1.0/me",
                "scopes": ["user.read"]
            },
        }
    }
    ```

5. If you are authenticating with **Azure AD B2C**, user-flows and/or policies should be provided as well:

```JSON
{
    // ...
    "policies": {
        "signUpSignIn": {
            "authority": "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/B2C_1_susi"
        }, 
    }
}
```

## Integration with the Express.js authentication wrapper

To initialize the wrapper, import it and supply the settings file and an (optional) persistent cache as below:

```javascript
const settings = require('../../appSettings.json');
const cache = require('../utils/cachePlugin');

const msalWrapper = require('msal-express-wrapper');

const authProvider = new msalWrapper.AuthProvider(settings, cache);
```

Once the wrapper is initialized, you can use it as below:

### Authentication

These routes are dedicated to the wrapper for handing authorization and token requests. They do not serve any page.

```javascript
// authentication routes
app.get('/signin', authProvider.signIn);
app.get('/signout', authProvider.signOut);
app.get('/redirect', authProvider.handleRedirect);
```

### Securing routes

Simply add the `isAuthenticated` middleware before the controller that serves the page you would like to secure:

```javascript
// secure routes
app.get('/id', authProvider.isAuthenticated, mainController.getIdPage);
```

### Acquiring tokens

Simply add the `getToken` middleware before the controller that makes a call to the web API that you would like to access. The access token will be available as a *session variable*:

```javascript
// secure routes that call protected resources
app.get('/profile', authProvider.isAuthenticated, authProvider.getToken, mainController.getProfilePage); // get token for this route to call web API
```

## Remarks

### Session support

Session support in this sample is provided by the [express-session](https://www.npmjs.com/package/express-session) package. **express-session** is considered unfit for production, and you should either implement your own session solution or use a more suitable 3rd party library.

### Persistent caching

MSAL Node has an in-memory cache by default. This sample also features a persistent cache plugin in order to save the cache to disk. This plugin is not meant to be production-ready. As such, you might want to implement persistent caching using a 3rd party library like [redis](https://redis.io/).

## More information

* [Initializing a confidential client app with MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md)
* [MSAL Node Configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md)
* [Scenario: A web app that calls web APIs](https://docs.microsoft.com/azure/active-directory/develop/scenario-web-app-call-api-overview)
