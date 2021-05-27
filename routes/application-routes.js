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


router.get("/newaccount", async function(req, res) {
    res.render("newaccount");
});


router.get("/accountdetails", async function(req, res) {
    //Change user id input later, this is hardcoded for now//
    const userinfo = await testDao.retrieveUserById(2);
    res.locals.user = userinfo;

    testDao.deleteCommentById(1);

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