const { Buffer } = require("node:buffer");

const handleClaimsChallenge = async (response) => {
    if (response.status === 200) {
        return await response.json();
    } else if (response.status === 401) {
        if (response.headers.get("WWW-Authenticate")) {
            const authenticateHeader = response.headers.get("WWW-Authenticate");
            const claimsChallenge = parseChallenges(authenticateHeader);
            return {
                errorMessage: "claims_challenge_occurred",
                payload: claimsChallenge.claims,
            };
        }
        throw new Error(`Unauthorized: ${response.status}`);
    } else {
        throw new Error(
            `Something went wrong with the request: ${response.status}`
        );
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

const setClaims = (req, clientId, graphEndPoint, claims) => {
    const resource = new URL(graphEndPoint).hostname;
    const oid = req.session.account.idTokenClaims.oid;
    const key = `cc.${clientId}.${oid}.${resource}`;
    if (
        req.session &&
        req.session.claims &&
        Object.keys(req.session.claims).length > 0
    ) {
        
        req.session.claims[key] = claims;
    } else {
        req.session.claims = {};
        req.session.claims[key] = claims;
    }
};
const getClaims = (req, clientId, graphEndPoint) => {
    if (req.session && req.session.claims && Object.keys(req.session.claims).length > 0) {
        const resource = new URL(graphEndPoint).hostname;
        const oid = req.session.account.idTokenClaims.oid;
        const key = `cc.${clientId}.${oid}.${resource}`;
        return Buffer.from(req.session.claims[key], "base64").toString();
    }
    return null;
};

const hasClaims = (req) => {
     if (req.session && req.session.claims && Object.keys(req.session.claims).length > 0) {
        return true
     }
     return false
}

module.exports = {
    handleClaimsChallenge: handleClaimsChallenge,
    setClaims: setClaims,
    getClaims: getClaims,
    hasClaims: hasClaims,
};