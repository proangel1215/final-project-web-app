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


// Retrieve all articles
// Create an array of article usernames and avatars to display in article cards
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


// Renders create account view
router.get("/create-account", async function(req, res) {
    res.render("create-account");
});


/**
 * When user submits account to be created, get all account detail input
 * Check if both password inputs match
 * If so hash and salt the plain text password
 * Create a new authToken
 * If user successfully created in database, redirect to home
 * If not, redirect to create account
 */
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

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

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


// Renders account details view and allows for password updated message
router.get("/account-details", verifyAuthenticated, async function(req, res) {
    res.locals.message = req.query.message;
    res.render("account-details");
});


// Renders edit account view
router.get("/edit-account", verifyAuthenticated, async function(req, res) {
    res.render("edit-account");
});


/**
 * Ensure user is logged in
 * Get current user details 
 * Get updated user account details, else retain current details
 * Update new username on user's articles
 * Update user details in database
 */
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


// Renders change password view
router.get("/change-password", function(req, res) {
    res.render("change-password");
});


/**
 * Retrieve logged in user
 * Get user's new entered password
 * Hash and salt new password
 * Update database
 */
router.post("/change-password", async function(req, res) {
    
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);

    const plaintextPassword = req.body.newPassword;

    const saltRounds = 10;
    const hash = await bcrypt.hash(plaintextPassword, saltRounds);

    user.password = hash;

    await appDao.updatePassword(user);

    res.locals.user = user;
    res.redirect("/account-details?message=Password changed!");    
});


/**
 * Retrieve logged in user details
 * Delete user account in database
 * Display success message to user
 */
 router.post("/deleteuser", async function(req, res) {
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    await appDao.deleteUserById(user.id);
    res.redirect("./login?message=Successfully deleted account!");
});


/**
 * Ensure user is logged in
 * Allow for a message to show for "successfully deleted article" message
 * Get user ID and articles belonging to user
 */
 router.get("/my-articles", verifyAuthenticated, async function(req, res) {

    res.locals.message = req.query.message;
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const articles = await appDao.retrieveArticlesByAuthorId(user.id); 

    for (let i = 0; i < articles.length; i++){
        const author = await appDao.retrieveUserById(articles[i].userID); 
        articles[i].userImage = author.imageSource;
    };

    res.locals.articles = articles;

    res.render("my-articles");
});


// Renders create-article view
router.get("/create-article", verifyAuthenticated, async function(req, res) {
    res.render("create-article");
});


/**
 * Ensure user is logged in
 * Gets new article title and WYSIWYG content to create a new article
 * If an image is uploaded, process file upload, rename and resize image
 * If an image is uploaded, set image source name, else set image source as null
 * Create a new article in the database
 * Retrieve new article and redirect to display on read-article page
 */
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
        resizedImage.resize(800, jimp.AUTO); // nice size fit for landscape
        await resizedImage.write(`./public/imagesResized/${imageFile.originalname}`);

        imageSource = imageFile.originalname;
    }
    
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const newArticle = {title: title, content: content, imageSource: imageSource, userID: user.id, username: user.username}; 
    await appDao.createNewArticle(newArticle);

    const newArticleID = await appDao.retrieveNewArticleID();

    res.redirect(`/read-article?articleID=${newArticleID}`);
}); 


/**
 * Ensure user is logged in
 * Get ID of article to be edited
 * Retrieve article content and send to be displayed in edit-article
 */
router.get("/edit-article", verifyAuthenticated, async function(req, res) {

    const editedArticleID = req.query.articleID;
    const article = await appDao.retrieveArticleById(editedArticleID); 
    res.locals.article = article;
    
    res.render("edit-article");
});


/**
 * Ensure user is logged in
 * Get current article ID, title, imageSource, and content
 * If user checks delete file box, set imageSource to null
 * If a new image is uploaded, process file upload, rename and resize image
 * If a new image is uploaded, set new image source name
 * Update article in the database
 * Retrieve updated article and redirect to display on read-article page
 */
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


 // Retrieves article ID, user, and article comments
 // Comments are sorted into arrays of children for nesting
router.get('/read-article', async function (req, res) {

    const articleID = req.query.articleID;
    let votedComments = new Array();
    const article = await appDao.retrieveArticleById(articleID); 
    res.locals.article = article;

    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user; 

    if (user != undefined) {
        if (user.id == article.userID) {
            res.locals.author = true;
        }
    }
    
    const comments = await appDao.retrieveCommentsByArticleId(articleID); 
    var newcomments = null;
    if (comments.length != 0) {
        var usersArray = new Array(); 
        for (let i = 0; i < comments.length; i++){
            usersArray[i] = await appDao.retrieveUserById(comments[i].commenterID);
            comments[i].username = usersArray[i].username;
            comments[i].imageSource = usersArray[i].imageSource;
        }

        const unflatten = data => {
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
                        for (let a = 0; a < voter.length; a++) {
                            const check = voter[a];
                            if (user.id == check.voterID) {
                                votedComments.push(commentID);
                            }
                        }
                    }
                    
            }
        }
        
    }

    res.locals.votedComments = votedComments;
    res.locals.comments = newcomments;

    res.render("read-article");
  });


/**
 * Get article ID of requested article to be deleted
 * Delete article in database
 * Send message to user notifying success
 */
router.post("/delete-article", verifyAuthenticated, async function (req, res) {

    const id = req.body.hiddenIDbox;
    await appDao.deleteArticleById(id);
    res.redirect("./my-articles?message=Successfully deleted your article!");
});



 // Gets user comment input, user ID, and article ID to create a new comment in the database
 // Redirects to article to display new comment
 router.post("/createComment", async function(req, res) {

    const content = req.body.commentInput; 
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken); 
    const articleID = req.body.articleID;
    const comment = {content: content, commenterID: user.id, articleID: articleID, parentID: null}; 
    await appDao.createComment(comment);
    
    res.redirect(`/read-article?articleID=${articleID}`);
});


/**
 * Gets user reply to comment input, user ID, article ID, and parent comment ID
 * Creates a new comment in the database
 * Redirects to article to display new comment
 */
router.post("/replyToComment", async function(req, res) {

    const content = req.body.replyToCommentInput; 
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken); 
    const articleID = req.body.articleID;
    const parentID = req.body.parentID;
    const comment = {content: content, commenterID: user.id, articleID: articleID, parentID: parentID}; 
    await appDao.createComment(comment);

    res.redirect(`/read-article?articleID=${articleID}`);
});


/**
 * Gets user reply to nested comment, user ID, article ID, and parent comment ID
 * Creates a new comment in the database
 * Redirects to article to display new comment
 */
router.post("/replyToCommentsComment", async function(req, res) {

    const content = req.body.replyToCommentsCommentInput; 
    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken); 
    const articleID = req.body.articleID;
    const parentID = req.body.parentID;
    const comment = {content: content, commenterID: user.id, articleID: articleID, parentID: parentID}; 
    await appDao.createComment(comment);

    res.redirect(`/read-article?articleID=${articleID}`);
});


  /**
   * When request is made to /giveupvote, get commentID, userID, and articleID
   * Add upvote in database
   * Redirects to article to display new upvote
   */
   router.post("/giveupvote", verifyAuthenticated, async function (req, res) {

    const commentID = req.body.comment;
    const userid = req.body.userid;
    const articleid = req.body.articleid;

    await appDao.addUpvoteByCommentId(commentID, userid);

    res.redirect(`/read-article?articleID=${articleid}`);
});


/**
   * When request is made to /givedownvote, get commentID, userID, and articleID
   * Add downvote in database
   * Redirects to article to display new upvote
   */
router.post("/givedownvote", verifyAuthenticated, async function (req, res) {

    const commentID = req.body.comment;
    const userid = req.body.userid;
    const articleid = req.body.articleid;

    await appDao.addDownvoteByCommentId(commentID, userid);

    res.redirect(`/read-article?articleID=${articleid}`);
});


// Retieves all usernames
router.get("/usernames", async function(req, res) {
    const usernames = await appDao.retrieveAllUsernames();
    res.json(usernames);
});


// Retrieves all user avatars
router.get("/avatars", async function(req, res) {
    const avatars = await appDao.retrieveAvatars();
    res.json(avatars);
});


 // Retrieves all articles for home page based on user sort option
router.get("/articles", async function(req, res){

    const sortBy = req.query.sortBy;
    const articles = await appDao.retrieveArticlesBySort(sortBy);

    res.json(articles);
});


 // Ensure user is logged in
 // Retrieves all logged in user's articles for my-articles based on user sort option
router.get("/my-sorted-articles", verifyAuthenticated, async function(req, res){

    const user = await authDao.retrieveUserWithAuthToken(req.cookies.authToken);
    const sortBy = req.query.sortBy; 
    const articles = await appDao.retrieveMyArticlesBySort(user.id, sortBy);

    res.json(articles);
});

module.exports = router;