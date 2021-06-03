const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

    //USER FUNCTIONS//
//Gets users but inputted ID number

async function retrieveUserById(id) {
    const db = await dbPromise;
    const user = await db.get(SQL`
        SELECT * FROM users
        WHERE id = ${id}`);
    return user;
};

//Gets all users

async function retrieveAllUsers() {
    const db = await dbPromise;
    return await db.all(SQL`SELECT * FROM users`);
};

//Gets all usernames

async function retrieveAllUsernames() {
    const db = await dbPromise;
    return await db.all(SQL`SELECT username FROM users`);
};

//Deletes a user account using an input of their id. The function deletes their articles first, then their comments and votes then finally deletes the 
//user account. 

async function deleteUserById(id) {
    const db = await dbPromise;
    const userArticles = await db.all(SQL`SELECT id FROM articles WHERE userID = ${id}`);
    if (userArticles != null || nestedID != undefined) {
        for (let i = 0; i < userArticles.length; i++) {
            const articleID = userArticles[i];
            await deleteArticleById(articleID.id);
        }
    }

    const userComments = await db.all(SQL`SELECT id FROM comments WHERE commenterID = ${id}`);
    if (userComments != null || nestedID != undefined) {
        for (let i = 0; i < userComments.length; i++) {
            const commentID = userComments[i];
            await deleteCommentById(commentID.id);
        }
    }

    const uservotes = await db.all(SQL`SELECT voterID FROM votes WHERE voterID = ${id}`);
    if (uservotes != null || nestedID != undefined) {
        await db.run(SQL`DELETE FROM votes WHERE voterID = ${id}`);
    }

    return await db.run(SQL`DELETE FROM users WHERE id = ${id}`);
};

//Creates a user account in the database using inputs of firstname, lastname, username, date of birth, password, description, imageSoruce(avatar) and 
//assigns an auth token

async function createUser(user) {
    const db = await dbPromise;
    const newUser =  await db.run(SQL`INSERT INTO users (fname, lname, username, dob, password, description, imageSource, authToken) VALUES (${user.fname}, ${user.lname}, ${user.username}, ${user.dob}, ${user.password}, ${user.description}, ${user.imageSource}, ${user.authToken})`);
    user.id = newUser.lastID;
    return newUser;
};

//Updates the users details in the database using inputs of firstname, lastname, username, date of birht, description and imageSource(avatar) using their
//previously assigned unique user id

async function editUser(id, fname, lname, username, dob, description, imageSource) {
    const db = await dbPromise;
    return await db.run(SQL`UPDATE users SET fname = ${fname}, lname = ${lname}, username = ${username}, dob = ${dob}, description = ${description}, imageSource = ${imageSource} WHERE id = ${id};`);
};

    //ARTICLE FUNCTIONS//
//Gets all articles in order by post time

async function retrieveAllArticles() {
    const db = await dbPromise; 
    return await db.all(SQL`
    SELECT * FROM articles
    ORDER BY postTime DESC
    `);
}; 

//Gets all articles and sorts by the inputted desired sort

async function retrieveArticlesBySort(sortBy) {
    const db = await dbPromise; 
    return await db.all(`
    SELECT * FROM articles 
    ORDER BY ${sortBy}
    `); 
}; 

//Gets all articles by a specific user and sorts by desired sort using inputs of id and sortBy

async function retrieveMyArticlesBySort(id, sortBy) {
    const db = await dbPromise; 
    return await db.all(`
    SELECT * FROM articles 
    WHERE userID = ${id}
    ORDER BY ${sortBy}
    `); 
}; 

//Gets all articles by a specific author id using an id input

async function retrieveArticlesByAuthorId(id) {
    const db = await dbPromise;
    return await db.all(SQL`SELECT * FROM articles WHERE userID = ${id}`);
};

//Gets a single article using an id input

async function retrieveArticleById(id) {
    const db = await dbPromise;
    return await db.get(SQL`SELECT * FROM articles WHERE id = ${id}`);
};

//Adds a newly created article to the database using inputs of title, content, imagesource, userid and username

async function createNewArticle(article) {
    const db = await dbPromise;
    return await db.run(SQL`
        INSERT INTO articles (title, postTime, content, imageSource, userID, username) VALUES (${article.title}, CURRENT_TIMESTAMP, ${article.content}, ${article.imageSource}, ${article.userID}, ${article.username})`);
};

//Gets the article id of the newly created article

async function retrieveNewArticleID() {
    const db = await dbPromise;

    const newArticleID = await db.get(SQL`
        SELECT id FROM articles
        ORDER BY id desc`)
    
        return newArticleID.id;
};

//Deletes an article using an input of the article id. The function deletes the comments on the article first and then the article itself

async function deleteArticleById(id) {
    const db = await dbPromise;
    const articleComments = await db.all(SQL`SELECT id FROM comments WHERE articleID = ${id}`);
    for (let i = 0; i < articleComments.length; i++) {
        const commentID = articleComments[i];
        await deleteCommentById(commentID.id);
    }
    return await db.run(SQL`DELETE FROM articles WHERE id = ${id}`);
};

//Updates the article content in the database using inputs of article id, title, content and imageSource

async function editArticle(id, title, content, imageSource) {
    const db = await dbPromise;
    return await db.run(SQL`UPDATE articles SET title = ${title}, content = ${content}, imageSource = ${imageSource} WHERE id = ${id};`);
};

    //COMMENT FUNCTIONS//
//Gets all comments that are attached to and article using an input of article id

async function retrieveCommentsByArticleId(id) {
    const db = await dbPromise;
    return await db.all(SQL`SELECT * FROM comments WHERE articleID = ${id}`);
};

//Deletes comments using a comment ID input. The child comments of the inputted comment are deleted first before the parent comment. 

async function deleteCommentById(id) {
    const db = await dbPromise;
    const nestedID = await db.get(SQL`SELECT id FROM comments WHERE parentCommentID = ${id}`);

        if (nestedID != null || nestedID != undefined) {
            const nestedID2 = await db.get(SQL`SELECT id FROM comments WHERE parentCommentID = ${nestedID.id}`);
            if (nestedID2 != null || nestedID2 != undefined) {
                await deleteCommentById(`${nestedID2.id}`);
            }
            await db.run(SQL`DELETE FROM votes WHERE commentID = ${nestedID.id}`);
            await db.run(SQL`DELETE FROM comments WHERE id = ${nestedID.id}`);
            await db.run(SQL`DELETE FROM votes WHERE commentID = ${id}`);
            return await db.run(SQL`DELETE FROM comments WHERE id = ${id}`);
        } else {
            await db.run(SQL`DELETE FROM votes WHERE commentID = ${id}`);
            return await db.run(SQL`DELETE FROM comments WHERE id = ${id}`);
        }
};

//Inserts the newly created comment into the database using inputs of content, parent comment ID(if there is one), the commenters id and the articles id

async function createComment(comment){
    const db = await dbPromise; 
    const newComment = await db.run(SQL`INSERT INTO comments (postTime, content, parentCommentID, commenterID, articleID) VALUES (CURRENT_TIMESTAMP, ${comment.content}, ${comment.parentID}, ${comment.commenterID}, ${comment.articleID})`); 
    return newComment; 
};

    //VOTE FUNCTIONS//
//Gets all upvotes and downvotes on a comment using the comment id

async function retrieveVotesByCommentId(id) {
    const db = await dbPromise;
    votes = await db.get(SQL`SELECT upvotes, downvotes FROM comments WHERE id = ${id}`);
    return votes;
};

//Adds an upvote to a comment using an input of the users unique id and the id of the comment

async function addUpvoteByCommentId(id, userid) {
    const db = await dbPromise;
    await db.run(SQL`INSERT INTO votes (commentID, voterID) VALUES (${id}, ${userid});`);
    return await db.run(SQL`UPDATE comments SET upvotes = upvotes + 1 WHERE id = ${id}`);
};

//Adds an downvote to a comment using an input of the users unique id and the id of the comment

async function addDownvoteByCommentId(id, userid) {
    const db = await dbPromise;
    await db.run(SQL`INSERT INTO votes (commentID, voterID) VALUES (${id}, ${userid});`);
    return await db.run(SQL`UPDATE comments SET downvotes = downvotes + 1 WHERE id = ${id}`);
};

module.exports = {
    retrieveAllArticles,
    retrieveArticlesBySort,
    retrieveArticlesByAuthorId,
    retrieveArticleById,
    retrieveUserById,
    retrieveCommentsByArticleId,
    retrieveMyArticlesBySort,
    deleteUserById,
    retrieveVotesByCommentId,
    deleteCommentById,
    createUser,
    retrieveAllUsernames,
    addUpvoteByCommentId,
    deleteArticleById,
    createNewArticle,
    retrieveNewArticleID,
    createComment,
    addDownvoteByCommentId,
    editUser,
    editArticle,
    retrieveAllUsers
};
