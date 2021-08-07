/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const fetch = require('isomorphic-fetch');

/**
 * Simple function to call an Azure AD protected resource
 */
callAPI = async(endpoint, accessToken) => {

    if (!accessToken || accessToken === "") {
        throw new Error('No tokens found')
    }
    
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };
    
    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await fetch(endpoint, options);
        return response.json();
    } catch(error) {
        console.log(error)
        return error;
    }
}

module.exports = {
    callAPI
};
