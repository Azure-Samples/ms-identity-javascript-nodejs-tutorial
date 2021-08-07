describe('Sanitize configuration object', () => {
    let appSettings;

    beforeAll(() => {
        appSettings = require('./appSettings.js');
    });

    it('should define the config object', () => {
        expect(appSettings).toBeDefined();
    });

    it('should not contain client Id', () => {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(regexGuid.test(appSettings.appCredentials.clientId)).toBe(false);
    });

    it('should not contain tenant Id', () => {
        const regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(regexGuid.test(appSettings.appCredentials.tenantId)).toBe(false);
    });
});