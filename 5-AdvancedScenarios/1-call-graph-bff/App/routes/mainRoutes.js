const express = require('express');
const path = require('path');


const authController = require("../controllers/authController")
const router = express.Router();

router.get('/auth/login', authController.loginUser);
router.get('/auth/logout', authController.logoutUser)
router.post('/auth/redirect', authController.handleRedirect);
router.get('/auth/redirect', authController.handleRedirect);
router.get('/auth/isAuthenticated', authController.isAuthenticated);
router.get('/auth/profile', authController.profile)

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router