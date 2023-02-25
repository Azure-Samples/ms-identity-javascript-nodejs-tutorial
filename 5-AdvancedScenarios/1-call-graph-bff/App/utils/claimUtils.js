const { Buffer } = require("node:buffer");

const handleAnyClaimsChallenge = async (response) => {
    if (response.status === 200) {
        return await response.json();
    }

    if (response.status === 401) {
        if (response.headers.get("WWW-Authenticate")) {
            const authenticateHeader = response.headers.get("WWW-Authenticate");
            const claimsChallenge = parseChallenges(authenticateHeader);

            const err = new Error("A claims challenge has occurred");
            err.payload = claimsChallenge.claims;
            err.name = 'ClaimsChallengeAuthError';

            throw err;
        }

        throw new Error(`Unauthorized: ${response.status}`);
    } else {
        throw new Error(`Something went wrong with the request: ${response.status}`);
    }
};

const parseChallenges = (header) => {
    const schemeSeparator = header.indexOf(" ");
    const challenges = header.substring(schemeSeparator + 1).split(",");
    const challengeMap = {};

    challenges.forEach((challenge) => {
        const [key, value] = challenge.split("=");
        challengeMap[key.trim()] = decodeURI(value.replace(/['"]+/g, ""));
    });

    return challengeMap;
};

const setClaims = (session, clientId, endpoint, claims) => {
    const resource = new URL(endpoint).hostname;
    const oid = session.account.idTokenClaims.oid;
    const key = `cc.${clientId}.${oid}.${resource}`;

    if (session.claims) {
        session.claims[key] = claims;
    } else {
        session.claims = {
            [key]: claims,
        };
    }
};

const getClaims = (session, clientId, endpoint) => {
    if (hasClaims(session)) {
        const resource = new URL(endpoint).hostname;
        const oid = session.account.idTokenClaims.oid;
        const key = `cc.${clientId}.${oid}.${resource}`;

        return Buffer.from(session.claims[key], "base64").toString();
    }

    return null;
};

const hasClaims = (session) => {
    if (session.claims && Object.keys(session.claims).length > 0) {
        return true;
    }

    return false;
}

module.exports = {
    handleAnyClaimsChallenge,
    setClaims,
    getClaims
};