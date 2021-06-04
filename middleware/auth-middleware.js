const authDao = require("../modules/auth-dao.js");


/**
 * Sets res.locals.user to the logged in user using their authentication token cookie,
 * or sets it to undefined if no authentication cookie exists (i.e the user is not logged in).
 * The next function is then called.
 */
async function addUserToLocals(req, res, next) {
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user;
    next();
}


/**
 * Verifies if the user is logged in -
 * if a user exists in res.locals.user, call the next function,
 * otherwise redirect back to the login page.
 */
function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        next();
    }
    else {
        res.redirect("./login");
    } 
}


module.exports = {
    addUserToLocals,
    verifyAuthenticated
}