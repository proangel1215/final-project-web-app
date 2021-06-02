const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")

const authDao = require("../modules/auth-dao.js");
const appDao = require("../modules/app-dao.js");


// Used to simulate Java app sending login credentials - will be deleted before submitting
router.get("/api/login", function(req, res) {
    res.render("api-login-test");
});


// This route handler is invoked whenever the user attempts to log in from the Java app
router.post("/api/login", async function(req, res) {
    const userJSON = req.body;
    // console.log(userJSON);

    const username = userJSON.username;
    const plaintextPassword = userJSON.password;

    const hash = await authDao.retrieveHashByUsername(username);
    // console.log(hash);

    if (hash != undefined) {
        const passwordsMatch = await bcrypt.compare(plaintextPassword, hash.password);
        // console.log(passwordsMatch);

         // if the passwords match...
        if (passwordsMatch) {
            const user = await authDao.retrieveUserWithCredentials(username, hash.password);

            const authToken = uuid();
            user.authToken = authToken;
            await authDao.updateAuthToken(user);
            res.cookie("authToken", authToken);
            res.status(204).send();
        } else {
            res.status(401).send();
        }
    } else {
        res.status(401).send();
    }
});


// This route handler is invoked whenever the user logs out from the Java app
router.get("/api/logout", function(req, res) {
    res.clearCookie("authToken");
    res.status(204).send();
});


// This route handler returns an array of all users if the user is an admin, or a 401 response if they are not an admin or not a user
router.get("/api/users", async function(req, res) {
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);

    if (user) {
        if (user.admin) {
            const userArray = await appDao.retrieveAllUsers();

            for (i = 0; i < userArray.length; i++) {
                const userArticles = await appDao.retrieveArticlesByAuthorId(userArray[i].id);
                userArray[i].numArticles = userArticles.length;
            }

            res.json(userArray);
        } else {
            res.status(401).send();
        }
    } else {
        res.status(401).send();
    }
});


// This route handler deletes the user with the given id, as well as their articles and comments, if the requestor is an admin
router.delete("/api/users/:id", async function(req, res) {
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const userIdToDelete = req.params.id;

    console.log("User ID to delete: " + userIdToDelete);

    if (user) {
        if (user.admin) {
            const message = await appDao.deleteUserById(userIdToDelete);
            console.log(message);
            res.status(204).send();
        } else {
            res.status(401).send();
        }
    } else {
        res.status(401).send();
    }
});


// This test route handler renders a Handlebars view that runs a JS file that sends a DELETE request to router.delete 
router.get("/delete", async function(req, res) {
    res.render("api-delete-test");
})


module.exports = router;