/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Basic cryptography methods for generating GUIDs and encoding state. 
 * Source: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node/src/crypto
 */
class CryptoUtilities {

    /**
     * Encodes a given string to base64.
     * @param {String} str: string to encode
     * @param {String} encoding: encoding format
     */
    static base64Encode(str, encoding) {
        return Buffer.from(str, encoding).toString("base64");
    }
    
    /**
     * Encodes a given string to base64 (URL friendly)
     * @param {String} str: string to encode
     * @param {String} encoding: encoding format
     */
    static base64EncodeUrl(str, encoding) {
        return this.base64Encode(str, encoding)
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    }
    
     /**
     * Decodes a given string from base64.
     * @param {String} base64Str 
     */
    static base64Decode(base64Str) {
        return Buffer.from(base64Str, "base64").toString("utf8");
    }

    /**
     * Decodes a given string from base64 (URL friendly).
     * @param {String} base64Str 
     */
    static base64DecodeUrl(base64Str) {
        let str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
        while (str.length % 4) {
            str += "=";
        }
        return this.base64Decode(str);
    }
    
    /**
     * Creates a new random GUID - used to populate state and nonce.
     * @returns string (GUID)
     */
    static generateGuid() {
        return uuidv4();
    }
    
    /**
     * Checks if a given string is GUID
     * @param {String} guid:  
     */
    static isGuid(guid) {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regexGuid.test(guid);
    }
}

module.exports = CryptoUtilities;