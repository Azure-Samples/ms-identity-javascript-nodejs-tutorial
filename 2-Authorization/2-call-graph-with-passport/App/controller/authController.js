const authProvider = require('../auth/AuthProvider');


exports.login = async (req, res, next) => {
    return authProvider.login(req, res, next)
}

exports.handleRedirect = async (req, res, next) => {
    return authProvider.handleRedirect(req, res, next);
};

exports.logout = async (req, res, next) => {
    return authProvider.logout(req, res, next);
}
