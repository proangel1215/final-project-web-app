const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");
const testDao = require("../modules/dao.js");


// Used to simulate Java app sending login credentials - will be deleted before submitting
router.get("/api/login", function(req, res) {
    res.render("api-login-test");
});


// This route handler is invoked whenever the user attempts to log in from the Java app
router.post("/api/login", async function(req, res) {
    const userJSON = req.body;
    console.log(userJSON);

    // Will need to convert from JSON string to JS object with actual implementation using the below code:
    // const userJS = JSON.parse(userJSON);
    // console.log(userJS);

    // Will need to obtain username and password from userJS not userJSON with actual implementation
    const username = userJSON.username;
    const password = userJSON.password;

    const user = await userDao.retrieveUserWithCredentials(username, password);

    if (user) {
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
        res.cookie("authToken", authToken);
        res.status(204).send();
    }
    else {
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
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);

    if (user) {
        if (user.admin) {
            const userArray = await testDao.retrieveAllUsers();

            for (i = 0; i < userArray.length; i++) {
                const userArticles = await testDao.retrieveArticlesByAuthorId(userArray[i].id);
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
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const userIdToDelete = req.params.id;

    console.log(userIdToDelete);

    if (user) {
        if (user.admin) {
            const message = await testDao.deleteUserById(userIdToDelete);
            console.log(message);
            res.status(204).send();
        } else {
            res.status(401).send();
        }
    } else {
        res.status(401).send();
    }
});


module.exports = router;