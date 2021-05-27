require('dotenv').config();

const express = require('express');
const identity = require("@azure/identity");
const keyvaultSecret = require('@azure/keyvault-secrets');

// importing from packages folder
const msalWrapper = require('../packages/msal-express-wrapper/dist');

const mainController = require('../controllers/mainController');

const config = require('../appSettings.json');
const cache = require('../utils/cachePlugin');

// initialize router
const router = express.Router();

// Importing from key vault
const keyVaultName = process.env["KEY_VAULT_NAME"];
const KVUri = "https://" + keyVaultName + ".vault.azure.net";
const secretName = process.env["SECRET_NAME"] ;

// Using VS Code's auth context for credentials
const credential = new identity.ManagedIdentityCredential();

// Initialize secretClient with credentials
const secretClient = new keyvaultSecret.SecretClient(KVUri, credential);

secretClient.getSecret(secretName).then((secretResponse) => {

    // assing the secret obtained from
    config.credentials.clientSecret = secretResponse.value;

    // initialize wrapper
    const authProvider = new msalWrapper.AuthProvider(config, cache);

    // app routes
    router.get('/', (req, res, next) => res.redirect('/home'));
    router.get('/home', mainController.getHomePage);

    // authentication routes
    router.get('/signin', authProvider.signIn);
    router.get('/signout', authProvider.signOut);
    router.get('/redirect', authProvider.handleRedirect);

    // secure routes
    router.get('/id', authProvider.isAuthenticated, mainController.getIdPage);
    router.get('/profile', authProvider.isAuthenticated, authProvider.getToken, mainController.getProfilePage); // get token for this route to call web API
    router.get('/tenant', authProvider.isAuthenticated, authProvider.getToken, mainController.getTenantPage) // get token for this route to call web API

    // 404
    router.get('*', (req, res) => res.status(404).redirect('/404.html'));

}).catch(err => console.log(err));

module.exports = router;