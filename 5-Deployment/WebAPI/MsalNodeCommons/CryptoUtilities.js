/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Basic cryptography methods for generating GUIDs and encoding state. 
 * Credits: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node/src/crypto
 */
class CryptoUtilities {

    static base64Encode(str, encoding) {
        return Buffer.from(str, encoding).toString("base64");
    }
    
    static base64EncodeUrl(str, encoding) {
        return this.base64Encode(str, encoding)
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    }
    
    static base64Decode(base64Str) {
        return Buffer.from(base64Str, "base64").toString("utf8");
    }

    static base64DecodeUrl(base64Str) {
        let str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
        while (str.length % 4) {
            str += "=";
        }
        return this.base64Decode(str);
    }
    
    static generateGuid() {
        return uuidv4();
    }
    
    static isGuid(guid) {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regexGuid.test(guid);
    }
}

module.exports = CryptoUtilities;