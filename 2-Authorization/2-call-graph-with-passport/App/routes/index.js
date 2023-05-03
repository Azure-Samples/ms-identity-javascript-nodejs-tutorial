var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render('index', {
            title: 'MSAL Node & Express Web App',
            isAuthenticated: req.isAuthenticated(),
            username: req.session.passport.user.displayName,
        });
    } else {
        res.render('index', { title: 'MSAL Node & Express Web App' });
    }
});

module.exports = router;
