const msal = require('@azure/msal-node');
const msalConfig =  require("./authConfig");

const msalInstance = new msal.ConfidentialClientApplication(msalConfig);

module.exports = msalInstance;