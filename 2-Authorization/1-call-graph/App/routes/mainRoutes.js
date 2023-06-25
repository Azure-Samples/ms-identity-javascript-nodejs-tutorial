const express = require('express');

const mainController = require('../controllers/mainController');

// initialize router
const router = express.Router();

// app routes
router.get('/', mainController.getHomePage);

// secure routes
router.get('/id', mainController.getIdPage);

// auth routes
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
);

router.get(
    '/tenant',
    mainController.getTenantPage
);

module.exports = router;