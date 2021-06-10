const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")

const authDao = require("../modules/auth-dao.js");
const appDao = require("../modules/app-dao.js");


/**
 * When a POST request is received, retrieve the inputted username and password
 * from the body. Retrieve the hashed password for the username from the
 * database and compare it to the inputted password. 
 * If the hashed password is undefined (i.e. the username does not exist),
 * send a 401 error code.
 * If the passwords match, log the user in and send a 204 success code.
 * If they don't match, send a 401 error code.
 */
router.post("/api/login", async function(req, res) {
    const userJSON = req.body;

    console.log(userJSON);

    const username = userJSON.username;
    const plaintextPassword = userJSON.password;

    console.log("Username: " + username);
    console.log("Password: " + plaintextPassword);

    const hash = await authDao.retrieveHashByUsername(username);

    console.log(hash);

    if (hash != undefined) {
        const passwordsMatch = await bcrypt.compare(plaintextPassword, hash.password);

        if (passwordsMatch) {
            const user = await authDao.retrieveUserWithCredentials(username, hash.password);
            
            if (user.admin) {
                const authToken = uuid();
                user.authToken = authToken;
                await authDao.updateAuthToken(user);
                res.cookie("authToken", authToken);

                console.log("Success - valid username and password!");
                res.status(204).send();
            } else {
                console.log("Failure - not an admin");
                res.status(401).send();
            }
        } else {
            console.log("Failure - valid username but invalid password");
            res.status(401).send();
        }
    } else {
        console.log("Failure - invalid username");
        res.status(401).send();
    }
});


// When a GET request is received, delete the authToken cookie and send a 204 success code
router.get("/api/logout", function(req, res) {
    res.clearCookie("authToken");
    res.status(204).send();
});


/**
 * When a GET request is received, return an array of all users if the requestor is an
 * admin. If the requestor is not an admin, or is not authenticated, send a 401 error code.
 */
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


/**
 * When a DELETE request is received, delete the user with the given ID from the 
 * database, as well as their articles and comments, if the requestor is an admin.
 * If the requestor is not an admin, or is not authenticated, send a 401 error code.
 */
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


module.exports = router;