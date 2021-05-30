const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();


// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao.js");


router.get("/login", async function(req, res) {
    if (res.locals.user) {
        res.redirect("/");
    }

    else {
        res.locals.message = req.query.message;
        res.render("login");
    }
});


router.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const user = await userDao.retrieveUserWithCredentials(username, password);

    // if there is a matching user...
    if (user) {
        // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
        res.cookie("authToken", authToken);
        res.locals.user = user;
        res.redirect("/");
    }

    // Otherwise, if there's no matching user...
    else {
        // Auth fail
        res.locals.user = null;
        res.redirect("./login?message=Username and/or password are incorrect");
    }
});


// Whenever we navigate to /logout, delete the authToken cookie.
// redirect to "/login", supplying a "logged out successfully" message.
router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.redirect("./login?message=Successfully logged out!");
});

module.exports = router;