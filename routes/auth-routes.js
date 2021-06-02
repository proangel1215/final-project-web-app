const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")


// The DAO that handles CRUD operations for users.
const authDao = require("../modules/auth-dao.js");


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
    const plaintextPassword = req.body.password;

    const hash = await authDao.retrieveHashByUsername(username);
    console.log(hash);

    if (hash != undefined) {
        const result = await bcrypt.compare(plaintextPassword, hash.password);
        console.log(result);

         // if the passwords match...
        if (result) {

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


// Whenever we navigate to /logout, delete the authToken cookie.
// redirect to "/login", supplying a "logged out successfully" message.
router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.redirect("./login?message=Successfully logged out!");
});

module.exports = router;