const request = require('supertest');
const { v4: uuidv4 } = require('uuid');

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
    let authConfig;
    let randomGuid;
    
    beforeAll(() => {
        process.env.NODE_ENV = 'test';

        authConfig = require('./authConfig.js');
        randomGuid = uuidv4();

        authConfig.auth.clientId = randomGuid;
        authConfig.auth.authority = randomGuid;

        app = require('./app.js');
    });

    it('should serve home page', async () => {

        const res = await request(app)
            .get('/');

        expect(res.statusCode).toEqual(200);
    });

    it('should protect id page', async () => {
        const res = await request(app)
            .get('/id');

        expect(res.statusCode).not.toEqual(200);
    });
});