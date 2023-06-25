const request = require('supertest');

describe('Sanitize configuration object', () => {
    let authConfig;

    beforeAll(() => {
        authConfig = require('./authConfig.js');
    });

    it('should define the config object', () => {
        expect(authConfig).toBeDefined();
    });

    it('should not contain client Id', () => {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(regexGuid.test(authConfig.auth.clientId)).toBe(false);
    });

    it('should not contain tenant Id', () => {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(regexGuid.test(authConfig.auth.tenantId)).toBe(false);
    });

    it('should not contain client secret', () => {
        const regexSecret = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{34,}$/;
        expect(regexSecret.test(authConfig.auth.clientSecret)).toBe(false);
    });
});

describe('Ensure pages served', () => {
    let app;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';

        const authConfig = require('./authConfig.js');
        const main = require('./app.js');

        authConfig.auth.authority = `https://login.microsoftonline.com/common`;
        authConfig.auth.clientId = "11111111-2222-3333-4444-111111111111";
        authConfig.auth.clientSecret = "11111111222233334444111111111111";

        app = await main();
        const SERVER_PORT = process.env.PORT || 4000;
        app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
    })

    it('should serve home page', async () => {
        const res = await request(app)
            .get('/');

        expect(res.statusCode).toEqual(302);
    });

    it('should protect id page', async () => {
        const res = await request(app)
            .get('/id');

        expect(res.statusCode).not.toEqual(200);
    });
});