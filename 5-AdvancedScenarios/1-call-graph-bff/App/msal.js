// const msal = require('@azure/msal-node');
const MsalWebAppWrapper = require("./auth/MsalWebAppWrapper");
const { msalConfig, REDIRECT_URI, POST_LOGOUT_REDIRECT_URI, TENANT_ID } = require('./authConfig');


const msalWrapper = new MsalWebAppWrapper({
    msalConfig: msalConfig,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
    tenantId: TENANT_ID,
});
module.exports = msalWrapper;