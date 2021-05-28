const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


// async function updateTestData(testData) {
//     const db = await dbPromise;

//     return await db.run(SQL`
//         update test
//         set stuff = ${testData.stuff}
//         where id = ${testData.id}`);
// }


async function retrieveUserById(id) {
    const db = await dbPromise;
    const user = await db.get(SQL`
        SELECT * FROM users
        WHERE id = ${id}`);
    return user;
};

async function retrieveAllUsernames() {
    const db = await dbPromise;
    return await db.all(SQL`SELECT username FROM users`);
};

async function retrieveAllArticles() {
    const db = await dbPromise; 
    return await db.all(SQL`
    SELECT * FROM articles
    ORDER BY postTime DESC
    `);
}; 

async function retrieveArticlesBySort(sortBy) {
    const db = await dbPromise; 
    return await db.all(`
    SELECT * FROM articles 
    ORDER BY ${sortBy}
    `); 
}; 

async function retrieveArticlesByAuthorId(id) {
    const db = await dbPromise;
    return await db.all(SQL`SELECT * FROM articles WHERE userID = ${id}`);
};

async function retrieveArticleById(id) {
    const db = await dbPromise;
    return await db.get(SQL`SELECT * FROM articles WHERE id = ${id}`);
};

async function retrieveCommentsByArticleId(id) {
    const db = await dbPromise;
    return await db.all(SQL`SELECT * FROM comments WHERE articleID = ${id}`);
};

async function retrieveVotesByCommentId(id) {
    const db = await dbPromise;
    votes = await db.get(SQL`SELECT upvotes, downvotes FROM comments WHERE id = ${id}`);
    return votes;
};

async function deleteUserById(id) {
    const db = await dbPromise;
    return await db.run(SQL`DELETE FROM users WHERE id = ${id}`);
};

async function deleteCommentById(id) {
    const db = await dbPromise;
    const nestedID = await db.get(SQL`SELECT id FROM comments WHERE parentCommentID = ${id}`);

        if (nestedID != null) {
            const nestedID2 = await db.get(SQL`SELECT id FROM comments WHERE parentCommentID = ${nestedID.id}`);
            await deleteCommentById(`${nestedID2.id}`);
            await db.run(SQL`DELETE FROM votes WHERE commentID = ${nestedID.id}`);
            await db.run(SQL`DELETE FROM comments WHERE id = ${nestedID.id}`);
            await db.run(SQL`DELETE FROM votes WHERE commentID = ${id}`);
            return await db.run(SQL`DELETE FROM comments WHERE id = ${id}`);
        } else {
            await db.run(SQL`DELETE FROM votes WHERE commentID = ${id}`);
            return await db.run(SQL`DELETE FROM comments WHERE id = ${id}`);
        }
};

async function addUpvoteByCommentId(id) {
    //not finished yet//
    const db = await dbPromise;
    return await db.run(SQL`UPDATE comments SET upvotes = ISNULL(upvotes, 0) + 1`);
};

async function createNewArticle(article) {
    //need if logged in function to get userID - placeholder ID used here
    const db = await dbPromise;
    await db.run(SQL`
        INSERT INTO articles (title, postTime, content, imageSource, userID) VALUES (${article.title}, CURRENT_TIMESTAMP, ${article.content}, ${article.imageSource}, ${article.userID})`);

    //select most recent article id where user = logged in user 
    const newArticleID = await db.run(SQL`
        SELECT id FROM articles
        WHERE id = ${article.userID}
        ORDER BY postTime
        LIMIT 1`)
    
        return newArticleID;
};

async function deleteArticleById(id) {
    const db = await dbPromise;
    return await db.run(SQL`DELETE FROM articles WHERE id = ${id}`)
};

async function createUser(user) {
    const db = await dbPromise;
    const newUser =  await db.run(SQL`INSERT INTO users (fname, lname, username, dob, password, description, imageSource, authToken) VALUES (${user.fname}, ${user.lname}, ${user.username}, ${user.dob}, ${user.password}, ${user.description}, ${user.imageSource}, ${user.authToken})`);
    user.id = newUser.lastID;
    return newUser;
};

module.exports = {
    retrieveAllArticles,
    retrieveArticlesBySort,
    retrieveArticlesByAuthorId,
    retrieveArticleById,
    retrieveUserById,
    retrieveCommentsByArticleId,
    deleteUserById,
    retrieveVotesByCommentId,
    deleteCommentById,
    createUser,
    retrieveAllUsernames,
    addUpvoteByCommentId,
    deleteArticleById,
    createNewArticle
};
