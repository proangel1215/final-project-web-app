const express = require("express");
const router = express.Router();

const testDao = require("../modules/test-dao.js");

router.get("/", async function(req, res) {

    res.render("home");
});


router.get("/my-articles", async function(req, res) {

    res.render("my-articles");
});


router.get("/read-article", async function(req, res) {

    res.render("read-article");
});


router.get("/login", async function(req, res) {
    res.render("login");
});


router.get("/new-account", async function(req, res) {
    res.render("new-account");
});

router.post("/new-account", async function(req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const dob = req.body.dob;
    const password = req.body.password;
    const rePassword = req.body.rePassword;
    const description = req.body.description;
    const imageSource = req.body.avatar;

    if (password == rePassword) {
        await testDao.createUser(fname, lname, username, dob, password, description, imageSource);
        res.redirect("/");
    } else {
        res.send("Please re-enter the same password");
    }
});


router.get("/accountdetails", async function(req, res) {
    //Change user id input later, this is hardcoded for now//
    const userinfo = await testDao.retrieveUserById(2);
    res.locals.user = userinfo;

    res.render("accountdetails");
});


router.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username);
    console.log(password);

    res.redirect("/");
});


router.get("/home", async function(req, res) {
    res.locals.articles = await testDao.retrieveAllArticles();
    //const sort = req.query.sort; 

    res.render("home");
}); 


module.exports = router;