const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");


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

    console.log(username);
    console.log(password);

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
router.get("/api/logout", async function(req, res) {
    res.clearCookie("authToken");
    res.status(204).send();
});


module.exports = router;