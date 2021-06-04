const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")


// The DAO that handles CRUD operations for users.
const authDao = require("../modules/auth-dao.js");

/**
 * When a GET request is received, if res.locals.user exists
 * (i.e. the user is logged in), redirect to the home view. 
 * Else, render the login view.
 */
router.get("/login", async function(req, res) {
    if (res.locals.user) {
        res.redirect("/");
    }

    else {
        res.locals.message = req.query.message;
        res.render("login");
    }
});

/**
 * When a POST request is received, retrieve the inputted username and password
 * from the body. Retrieve the hashed password for the username from the
 * database and compare it to the inputted password. 
 * If the hashed password is undefined (i.e. the username does not exist),
 * send an error message and redirect to the login view.
 * If they match, log the user in and redirect to the home view. 
 * If they don't match, send an eror message and redirect to the login view.
 */
router.post("/login", async function(req, res) {
    const username = req.body.username;
    const plaintextPassword = req.body.password;

    const hash = await authDao.retrieveHashByUsername(username);

    if (hash != undefined) {
        const passwordsMatch = await bcrypt.compare(plaintextPassword, hash.password);

        if (passwordsMatch) {
            const user = await authDao.retrieveUserWithCredentials(username, hash.password);

            // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
            const authToken = uuid();
            user.authToken = authToken;
            await authDao.updateAuthToken(user);
            res.cookie("authToken", authToken);
            res.locals.user = user;
            res.redirect("/");
        } else {
            res.locals.user = null;
            res.redirect("./login?message=Username and/or password are incorrect");
        }
    } else {
        res.locals.user = null;
        res.redirect("./login?message=Username and/or password are incorrect");
    }
});


/**
 * When a GET request is received, delete the user's authToken cookie
 * and redirect to the login view, supplying a "logged out successfully" message
 */
router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.redirect("./login?message=Successfully logged out!");
});


module.exports = router;