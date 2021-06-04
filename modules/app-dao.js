const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//USER FUNCTIONS//

// Gets a user by their ID number
async function retrieveUserById(id) {
    const db = await dbPromise;
    const user = await db.get(SQL`
        SELECT * FROM users
        WHERE id = ${id}`);
    return user;
};

// Gets all users
async function retrieveAllUsers() {
    const db = await dbPromise;
    return await db.all(SQL`SELECT * FROM users`);
};

// Gets all usernames
async function retrieveAllUsernames() {
    const db = await dbPromise;
    return await db.all(SQL`SELECT username FROM users`);
};

// Gets all avatars for all users
async function retrieveAvatars() {
    const db = await dbPromise;
    return await db.all(SQL`SELECT id, imageSource FROM users`);
};

/**
 * Deletes a user account using their ID number.
 * It deletes their articles first, then their comments and votes, then finally deletes the user account. 
 * then finally the user itself.
 */
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

/**
 * Creates a user in the database using inputs of firstname, lastname,
 * username, date of birth, password, description, imageSource (avatar), and auth token,
 * and auto-generates a unique ID number
 */
async function createUser(user) {
    const db = await dbPromise;

    const newUser =  await db.run(SQL`INSERT INTO users (fname, lname, username, dob, password, description, imageSource, authToken) VALUES (${user.fname}, ${user.lname}, ${user.username}, ${user.dob}, ${user.password}, ${user.description}, ${user.imageSource}, ${user.authToken})`);
    user.id = newUser.lastID;

    return newUser;
};

/**
 * Updates a user's details in the database using inputs of firstname, lastname,
 * username, date of birth, description and imageSource (avatar)
 * using their ID number
 */
async function editUser(id, fname, lname, username, dob, description, imageSource) {
    const db = await dbPromise;
    return await db.run(SQL`UPDATE users SET fname = ${fname}, lname = ${lname}, username = ${username}, dob = ${dob}, description = ${description}, imageSource = ${imageSource} WHERE id = ${id};`);
};

// Updates author name on all of their articles using the author's user id and inputted username
async function editAuthorOfArticles(username, id) {
    const db = await dbPromise;
    return await db.run(SQL`UPDATE articles SET username = ${username} WHERE id = ${id};`);
};

// Updates the user's password in the database using a user object
async function updatePassword(user) {
    const db = await dbPromise;
    return await db.run(SQL`
    UPDATE users
    SET password = ${user.password}
    WHERE id = ${user.id}`);
}



//ARTICLE FUNCTIONS//

// Gets all articles in order of post time descending (i.e newest first)
async function retrieveAllArticles() {
    const db = await dbPromise; 
    return await db.all(SQL`
    SELECT * FROM articles
    ORDER BY postTime DESC
    `);
}; 

// Gets all articles and sorts by the desired sortBy criteria
async function retrieveArticlesBySort(sortBy) {
    const db = await dbPromise; 
    return await db.all(`
    SELECT * FROM articles 
    ORDER BY ${sortBy}
    `); 
}; 

// Gets all articles by a specific user and sorts by desired sortBy criteria
async function retrieveMyArticlesBySort(id, sortBy) {
    const db = await dbPromise; 
    return await db.all(`
    SELECT * FROM articles 
    WHERE userID = ${id}
    ORDER BY ${sortBy}
    `); 
}; 

// Gets all articles by a specific author using their ID number
async function retrieveArticlesByAuthorId(id) {
    const db = await dbPromise;
    return await db.all(SQL`SELECT * FROM articles WHERE userID = ${id}`);
};

// Gets a single article using its ID number
async function retrieveArticleById(id) {
    const db = await dbPromise;
    return await db.get(SQL`SELECT * FROM articles WHERE id = ${id}`);
};

// Adds a newly created article to the database using an article object
async function createNewArticle(article) {
    const db = await dbPromise;
    return await db.run(SQL`
        INSERT INTO articles (title, postTime, content, imageSource, userID, username) VALUES (${article.title}, CURRENT_TIMESTAMP, ${article.content}, ${article.imageSource}, ${article.userID}, ${article.username})`);
};

// Gets the article id of the newly-created article
async function retrieveNewArticleID() {
    const db = await dbPromise;

    const newArticleID = await db.get(SQL`
        SELECT id FROM articles
        ORDER BY id desc`)
    
        return newArticleID.id;
};

// Deletes an article using its ID. It deletes comments on the article first and then the article itself.
async function deleteArticleById(id) {
    const db = await dbPromise;

    const articleComments = await db.all(SQL`SELECT id FROM comments WHERE articleID = ${id}`);
    for (let i = 0; i < articleComments.length; i++) {
        const commentID = articleComments[i];
        await deleteCommentById(commentID.id);
    }
    return await db.run(SQL`DELETE FROM articles WHERE id = ${id}`);
};

// Updates the article's properties in the database.
async function editArticle(id, title, content, imageSource) {
    const db = await dbPromise;
    return await db.run(SQL`UPDATE articles SET title = ${title}, content = ${content}, imageSource = ${imageSource} WHERE id = ${id};`);
};



//COMMENT FUNCTIONS//

// Gets all comments that are attached to an article using the article ID
async function retrieveCommentsByArticleId(id) {
    const db = await dbPromise;
    return await db.all(SQL`SELECT * FROM comments WHERE articleID = ${id}`);
};

// Deletes a comment using its ID. The child comments of the comment are deleted first before the parent comment. 
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

// Inserts the newly created comment into the database
async function createComment(comment){
    const db = await dbPromise; 
    const newComment = await db.run(SQL`INSERT INTO comments (postTime, content, parentCommentID, commenterID, articleID) VALUES (CURRENT_TIMESTAMP, ${comment.content}, ${comment.parentID}, ${comment.commenterID}, ${comment.articleID})`); 
    return newComment; 
};



//VOTE FUNCTIONS//

// Gets all upvotes and downvotes on a comment using comment ID
async function retrieveVotesByCommentId(id) {
    const db = await dbPromise;
    votes = await db.get(SQL`SELECT upvotes, downvotes FROM comments WHERE id = ${id}`);
    return votes;
};

// Adds an upvote to a comment using comment ID and voter ID
async function addUpvoteByCommentId(id, userid) {
    const db = await dbPromise;
    await db.run(SQL`INSERT INTO votes (commentID, voterID) VALUES (${id}, ${userid});`);
    return await db.run(SQL`UPDATE comments SET upvotes = upvotes + 1 WHERE id = ${id}`);
};

// Adds a downvote to a comment using comment ID and voter ID
async function addDownvoteByCommentId(id, userid) {
    const db = await dbPromise;
    await db.run(SQL`INSERT INTO votes (commentID, voterID) VALUES (${id}, ${userid});`);
    return await db.run(SQL`UPDATE comments SET downvotes = downvotes + 1 WHERE id = ${id}`);
};

// Retrieves the ID of a voter for a particular comment
async function getVoterIdByCommentId(id) {
    const db = await dbPromise;
    const voterID = await db.all(SQL`SELECT voterID FROM votes WHERE commentID = ${id}`);
    return voterID;
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
    retrieveAllUsers,
    updatePassword,
    editAuthorOfArticles,
    getVoterIdByCommentId,
    retrieveAvatars
};
