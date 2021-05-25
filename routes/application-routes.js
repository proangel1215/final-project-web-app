const express = require("express");
const router = express.Router();

const testDao = require("../modules/test-dao.js");

router.get("/", async function(req, res) {

    // res.locals.title = "My route title!";
    // res.locals.allTestData = await testDao.retrieveAllTestData();

    res.render("home");
});

router.get("/my-articles", async function(req, res) {

    res.render("my-articles");
});

router.get("/read-article", async function(req, res) {

    res.render("read-article");
});

module.exports = router;