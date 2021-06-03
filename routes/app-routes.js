const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const jimp = require("jimp");
const bcrypt = require("bcrypt")

const appDao = require("../modules/app-dao.js");
const authDao = require("../modules/auth-dao.js");
const multer = require("../modules/multer-uploader.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");


router.get("/", async function(req, res) {
    const articles = await appDao.retrieveAllArticles(); 
    
    var usersArray = new Array(); 
    for (let i = 0; i < articles.length; i++){
        usersArray[i] = await appDao.retrieveUserById(articles[i].userID); 
        articles[i].username = usersArray[i].username;
        articles[i].userImage = usersArray[i].imageSource;
        }; 

    res.locals.articles = articles;
    res.render("home");
}); 

router.get("/my-articles", verifyAuthenticated, async function(req, res) {
    res.locals.message = req.query.message;
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    // res.locals.articles = await appDao.retrieveArticlesByAuthorId(user.id); 

    const articles = await appDao.retrieveArticlesByAuthorId(user.id); 

    for (let i = 0; i < articles.length; i++){
        const author = await appDao.retrieveUserById(articles[i].userID); 
        articles[i].userImage = author.imageSource;
    }; 

    res.locals.articles = articles;

    res.render("my-articles");
});

router.post("/createComment", async function(req, res) {
    const content = req.body.commentInput; 
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken); 
    const articleID = req.body.articleID;
    console.log(articleID);
    const comment = {content: content, commenterID: user.id, articleID: articleID, parentID: null}; 
    await appDao.createComment(comment);
    
    res.redirect(`/read-article?articleID=${articleID}`);
});

router.post("/replyToComment", async function(req, res) {
    const content = req.body.replyToCommentInput; 
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken); 
    const articleID = req.body.articleID;
    const parentID = req.body.parentID;
    const comment = {content: content, commenterID: user.id, articleID: articleID, parentID: parentID}; 
    await appDao.createComment(comment);
    res.redirect(`/read-article?articleID=${articleID}`);
});

router.post("/replyToCommentsComment", async function(req, res) {
    const content = req.body.replyToCommentsCommentInput; 
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken); 
    const articleID = req.body.articleID;
    const parentID = req.body.parentID;
    const comment = {content: content, commenterID: user.id, articleID: articleID, parentID: parentID}; 
    await appDao.createComment(comment);
    res.redirect(`/read-article?articleID=${articleID}`);
});

router.get("/create-article", verifyAuthenticated, async function(req, res) {
    res.render("create-article");
});

router.post("/create-article", multer.upload.single("articleImage"), verifyAuthenticated, async function(req, res) {

    const title = req.body.articleTitle;
    let imageSource = null;
    const content = req.body.newArticleContent;

    if (req.file !== undefined) {
        const imageFile = req.file;
        const oldFileName = imageFile.path;
        const newFileName = `./public/imageUploads/${imageFile.originalname}`;
        fs.renameSync(oldFileName, newFileName);

        const resizedImage = await jimp.read(newFileName);
        resizedImage.resize(800, jimp.AUTO); // arbitrary size
        await resizedImage.write(`./public/imagesResized/${imageFile.originalname}`);

        imageSource = imageFile.originalname;
    }
    
    //create article in database
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const newArticle = {title: title, content: content, imageSource: imageSource, userID: user.id, username: user.username}; 
    await appDao.createNewArticle(newArticle);

    const newArticleID = await appDao.retrieveNewArticleID();

    res.redirect(`/read-article?articleID=${newArticleID}`);
}); 

router.get("/edit-article", verifyAuthenticated, async function(req, res) {

    const editedArticleID = req.query.articleID;
    const article = await appDao.retrieveArticleById(editedArticleID); 
    res.locals.article = article;
    
    res.render("edit-article");

});

router.post("/edit-article", multer.upload.single("articleImage"), verifyAuthenticated, async function(req, res) {

    const id = req.body.hiddenIDbox;
    const article = await appDao.retrieveArticleById(id); 

    const title = req.body.articleTitle;
    let imageSource = article.imageSource;
    const content = req.body.editedArticleContent;
    const deleteCheckbox = req.body.deleteImageButton;

    if (deleteCheckbox == "on") {
        imageSource = null;
    }

    if (req.file !== undefined) {
        const imageFile = req.file;
        const oldFileName = imageFile.path;
        const newFileName = `./public/imageUploads/${imageFile.originalname}`;
        fs.renameSync(oldFileName, newFileName);

        const resizedImage = await jimp.read(newFileName);
        resizedImage.resize(800, jimp.AUTO); // arbitrary size
        await resizedImage.write(`./public/imagesResized/${imageFile.originalname}`);

        imageSource = imageFile.originalname;
    }
    
    await appDao.editArticle(id, title, content, imageSource);

    res.redirect(`/read-article?articleID=${id}`);
});


router.get('/read-article', async function (req, res) {

    const articleID = req.query.articleID;
    let votedComments = new Array();
    //req.params = articleID;
    //console.log(articleID);
    const article = await appDao.retrieveArticleById(articleID); 
    //console.log(article); 
    res.locals.article = article;

    // Initialise user so we can check if userID = authorID: if so display edit article button
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    //console.log(user.id);
    res.locals.user = user; 

    if (user != undefined) {
        if (user.id == article.userID) {
            res.locals.author = true;
        }
    }
    
    //console.log(article.imageSource)
    const comments = await appDao.retrieveCommentsByArticleId(articleID); 
    //console.log(comments[0].id);
    var newcomments = null;
    if (comments.length != 0) {
        var usersArray = new Array(); 
        for (let i = 0; i < comments.length; i++){
            usersArray[i] = await appDao.retrieveUserById(comments[i].commenterID);
            comments[i].username = usersArray[i].username;
            comments[i].imageSource = usersArray[i].imageSource;
        }

        const unflatten = data => {
            // console.log(data);
            const tree = data.map(e => ({...e}))
                .sort((a, b) => a.id - b.id)
                .reduce((a, e) => {
                a[e.id] = a[e.id] || e;
                a[e.parentCommentID] = a[e.parentCommentID] || {};
                const parent = a[e.parentCommentID];
                parent.children = parent.children || [];
                parent.children.push(e);
                return a;
                }, {})
            ;
            return Object.values(tree)
                .find(e => e.id === undefined).children;
            };

        newcomments = unflatten(comments);
        
        if (user) {
            for (let i = 0; i < comments.length; i++) {
                    const commentID = comments[i].id;
                    const voter = await appDao.getVoterIdByCommentId(commentID);
                    if (voter != null || undefined) {
                        if (user.id == voter.voterID) {
                            votedComments.push(commentID);
                        }
                    }
                    
            }
        }
        
    }

    res.locals.votedComments = votedComments;
    res.locals.comments = newcomments;
    res.render("read-article");
  });

router.post("/delete-article", verifyAuthenticated, async function (req, res) {

    const id = req.body.hiddenIDbox;
    await appDao.deleteArticleById(id);
    res.redirect("./my-articles?message=Successfully deleted your article!");
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

        // Hashes and salts the provided password all in one go
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        // console.log("My hash: ", hash);

        const authToken = uuid();
        const newUser = {fname: fname, lname: lname, username: username, dob: dob, password: hash, description: description, imageSource: imageSource, authToken: authToken};
        await appDao.createUser(newUser);
        res.cookie("authToken", authToken);
        res.locals.user = newUser;
        res.redirect("/");
    } else {
        res.redirect("/create-account");
    }
});

router.get("/usernames", async function(req, res) {
    const usernames = await appDao.retrieveAllUsernames();
    res.json(usernames);
});

router.get("/avatars", async function(req, res) {
    const avatars = await appDao.retrieveAvatars();
    res.json(avatars);
});


router.get("/account-details", verifyAuthenticated, async function(req, res) {
    res.locals.message = req.query.message;
    res.render("account-details");
});


router.get("/articles", async function(req, res){
    const sortBy = req.query.sortBy;
    const articles = await appDao.retrieveArticlesBySort(sortBy);
    res.json(articles);
});

router.get("/my-sorted-articles", verifyAuthenticated, async function(req, res){
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const sortBy = req.query.sortBy; 
    const articles = await appDao.retrieveMyArticlesBySort(user.id, sortBy);
    res.json(articles);
});


router.get("/edit-account", verifyAuthenticated, async function(req, res) {
    res.render("edit-account");
});


router.post("/edit-account", verifyAuthenticated, async function(req, res) {

    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);

    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const dob = req.body.dob;
    const description = req.body.description;
    var imageSource = req.body.avatar;

    if (imageSource == null || imageSource == undefined) {
        var imageSource = user.imageSource;
    }
    
    await appDao.editAuthorOfArticles(username, user.id);
    await appDao.editUser(user.id, fname, lname, username, dob, description, imageSource);
    res.redirect("account-details");
});


router.post("/deleteuser", async function(req, res) {
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    await appDao.deleteUserById(user.id);
    res.redirect("./login?message=Successfully deleted account!");
});


router.get("/change-password", function(req, res) {
    res.render("change-password");
});


router.post("/change-password", async function(req, res) {
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);

    const plaintextPassword = req.body.newPassword;

    // Hashes and salts the provided password all in one go
    const saltRounds = 10;
    const hash = await bcrypt.hash(plaintextPassword, saltRounds);

    user.password = hash;

    await appDao.updatePassword(user);

    res.locals.user = user;
    res.redirect("/account-details?message=Password changed!");    
});


module.exports = router;