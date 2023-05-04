
const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const csrf = require('lusca').csrf;

const mainRouter = require("./routes/mainRoutes");

const { 
    SESSION_COOKIE_NAME, 
    REDIRECT_URI 
} = require('./authConfig');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/build')));

const sessionConfig = {
    name: SESSION_COOKIE_NAME,
    secret: 'ENTER_YOUR_SECRET_HERE', // replace with your own secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'strict',
        httpOnly: true,
        secure: false, // set this to true on production
    },
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy e.g. App Service
    sessionConfig.cookie.secure = true; // serve secure cookies on production
}

app.use(session(sessionConfig));
app.use(csrf({
    blocklist: [new URL(REDIRECT_URI).pathname],
}));

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
})

app.use(mainRouter);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});