const request = require('supertest');
const { v4: uuidv4 } = require('uuid');

describe('Sanitize configuration object', () => {
    let appSettings;

    beforeAll(() => {
        appSettings = require('./appSettings.js');
    });

    it('should define the config object', () => {
        expect(appSettings).toBeDefined();
    });

    it('should contain client Id', () => {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(regexGuid.test(appSettings.appCredentials.clientId)).toBe(true);
    });

    it('should contain tenant Id', () => {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(regexGuid.test(appSettings.appCredentials.tenantId)).toBe(true);
    });

    it('should contain client secret', () => {
        const regexSecret = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{34,}$/;
        expect(regexSecret.test(appSettings.appCredentials.clientSecret)).toBe(true);
    });
});

describe('Ensure pages served', () => {

    let app;
    let appSettings;
    let randomGuid;
    
    beforeAll(() => {
        process.env.NODE_ENV = 'test';

        appSettings = require('./appSettings.js');
        randomGuid = uuidv4();

        appSettings.appCredentials.clientId = randomGuid;
        appSettings.appCredentials.tenantId = randomGuid;

        app = require('./app.js');
    });

    it('should serve home page', async () => {

        const res = await request(app)
            .get('/home');

        expect(res.statusCode).toEqual(200);
    });

    it('should protect id page', async () => {
        const res = await request(app)
            .get('/id');

        expect(res.statusCode).not.toEqual(200);
    });
});