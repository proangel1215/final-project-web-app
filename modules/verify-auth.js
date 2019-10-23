/**
 * This function can be added before any route handler function. It will verify that there is a valid
 * authenticated user. If there is, the route handler function will be called. If not, the user will be
 * redirected to /login instead.
 */
function verifyAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect("/login");
    }
}

module.exports = verifyAuthenticated;