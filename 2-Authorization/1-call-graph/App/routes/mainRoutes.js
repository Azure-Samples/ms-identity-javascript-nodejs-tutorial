const express = require('express');

const mainController = require('../controllers/mainController');

// initialize router
const router = express.Router();

// app routes
router.get('/', mainController.getHomePage);

// secure routes
router.get('/id', mainController.getIdPage);

// secure routes
router.get(
    '/signout',
    (req, res, next) => {
        return req.authContext.logout({
            postLogoutRedirectUri: "/",
        })(req, res, next);
    }
);

router.get(
    '/profile',
    mainController.getProfilePage
); // get token for this route to call web API

router.get(
    '/tenant',
    mainController.getTenantPage
); // get token for this route to call web API

module.exports = router;