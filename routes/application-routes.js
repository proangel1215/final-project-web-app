const express = require("express");
const router = express.Router();

const testDao = require("../modules/test-dao.js");

// router.get("/", async function(req, res) {

//     // res.locals.title = “My route title!“;
//     // res.locals.allTestData = await testDao.retrieveAllTestData();

//     res.render("home");
// });

router.get("/login", async function(req, res) {
    res.render("login");
});

router.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username);
    console.log(password);

    res.redirect("/");
});

router.get("/", async function(req, res) {
    res.locals.articles = await testDao.retrieveArticlesBySort(); 
    res.render("home");
}); 

// router.get("/getSort", async function(req, res) {
//     const sortBy = req.query.sort; 
//     res.json(sortBy);
// });

module.exports = router;