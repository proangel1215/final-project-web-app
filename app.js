/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const app = express();
const port = 3000;

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setup body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Setup routes
const appRouter = require("./routes/application-routes.js");
const { retrieveAllArticles } = require("./modules/test-dao.js");
app.use(appRouter);

// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});

// Get the sort request in home view 
app.get("/home", function (req, res) {
    res.send(retrieveAllArticles());
    console.log(retrieveAllArticles())
});