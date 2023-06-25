/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { DefaultAzureCredential } = require( "@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

async function getCredentialFromKeyVault(keyVaultUrl, credentialName) {
    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(keyVaultUrl, credential);

    const keyVaultSecret = await secretClient.getSecret(credentialName);

    return keyVaultSecret.value;
}

module.exports = {
    getCredentialFromKeyVault
};