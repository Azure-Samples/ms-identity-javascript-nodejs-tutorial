

const main = require("./app");

(async () => {
    const app = await main();
    const SERVER_PORT = process.env.PORT || 4000;
    app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
})();