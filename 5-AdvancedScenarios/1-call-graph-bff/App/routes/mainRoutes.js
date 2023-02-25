const path = require('path');
const express = require('express');

const authController = require("../controllers/authController")

const router = express.Router();

router.get('/auth/login', authController.loginUser);
router.get('/auth/logout', authController.logoutUser)
router.post('/auth/redirect', authController.handleRedirect);
router.get('/auth/account', authController.getAccount);
router.get('/auth/profile', authController.getProfile);

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router