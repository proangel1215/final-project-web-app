const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

const testDao = require("../modules/dao.js");
const userDao = require("../modules/users-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");


router.get("/", async function(req, res) {
    res.locals.articles = await testDao.retrieveAllArticles(); 
    res.render("home");
}); 


router.get("/my-articles", verifyAuthenticated, async function(req, res) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.articles = await testDao.retrieveArticlesByAuthorId(user.id); 
    res.render("my-articles");
});


router.get("/read-article", async function(req, res) {
    res.render("read-article");
});

router.get("/create-article", verifyAuthenticated, async function(req, res) {
    res.render("create-article");
});

router.post("/create-article", verifyAuthenticated, async function(req, res) {

    const title = req.body.articleTitle;
    const imageSource = req.body.articleImage;
    const content = req.body.newArticleContent;
    
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const newArticle = {title: title, content: content, imageSource: imageSource, userID: user.id}; 
    const newArticleID = await testDao.createNewArticle(newArticle);
    console.log(newArticleID);
    //get ID of newly created article

    res.redirect("/");
}); 


router.get("/create-account", async function(req, res) {
    res.render("create-account");
});

router.post("/create-account", async function(req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const dob = req.body.dob;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const description = req.body.description;
    const imageSource = req.body.avatar;

    if (password == confirmPassword) {
        const authToken = uuid();
        const newUser = {fname: fname, lname: lname, username: username, dob: dob, password: password, description: description, imageSource: imageSource, authToken: authToken};
        await testDao.createUser(newUser);
        res.cookie("authToken", authToken);
        res.locals.user = newUser;
        res.redirect("/");
    } else {
        res.redirect("/create-account");
    }
});


router.get("/usernames", async function(req, res) {
    const usernames = await testDao.retrieveAllUsernames();
    res.json(usernames);
});


router.get("/account-details", verifyAuthenticated, async function(req, res) {
    res.render("account-details");
});


router.get("/articles", async function(req, res){
    const sortBy = req.query.sortBy;
    const articles = await testDao.retrieveArticlesBySort(sortBy);
    var usersArray = new Array(); 
    for (let i = 0; i < articles.length; i++){
    usersArray[i] = await testDao.retrieveUserById(articles[i].userID); 
    articles[i].username = usersArray[i].username;
    }; 
    res.json(articles);
});

module.exports = router;