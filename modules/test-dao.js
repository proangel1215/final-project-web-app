const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

// async function createTestData(testData) {
//     const db = await dbPromise;

//     const result = await db.run(SQL`
//         insert into test (stuff) values(${testData.stuff})`);

//     testData.id = result.lastID;
// }

// async function retrieveTestDataById(id) {
//     const db = await dbPromise;

//     const testData = await db.get(SQL`
//         select * from test
//         where id = ${id}`);

//     return testData;
// }

// async function retrieveAllTestData() {
//     const db = await dbPromise;

//     const allTestData = await db.all(SQL`select * from test`);

//     return allTestData;
// }

// async function updateTestData(testData) {
//     const db = await dbPromise;

//     return await db.run(SQL`
//         update test
//         set stuff = ${testData.stuff}
//         where id = ${testData.id}`);
// }

// async function deleteTestData(id) {
//     const db = await dbPromise;

//     return await db.run(SQL`
//         delete from test
//         where id = ${id}`);
// }

// // Export functions.
// module.exports = {
//     createTestData,
//     retrieveTestDataById,
//     retrieveAllTestData,
//     updateTestData,
//     deleteTestData
// };

async function retrieveUserById(id) {
    const db = await dbPromise;
    const user = await db.get(SQL`
        SELECT fname, lname, username, dob, description, imageSource FROM users
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
    const userArticles = await db.all(SQL`SELECT id FROM articles WHERE userID = ${id}`);
    //console.log(id);
    //console.log(userArticles);
    if (userArticles != null || nestedID != undefined) {
        //console.log("User articles deletion in progress");
        for (let i = 0; i < userArticles.length; i++) {
            const articleID = userArticles[i];
            //console.log (articleID);
            await deleteArticleById(articleID.id);
            //console.log("Deleted Article");
        }
    }

    const userComments = await db.all(SQL`SELECT id FROM comments WHERE commenterID = ${id}`);
    //console.log (userComments);
    if (userComments != null || nestedID != undefined) {
        //console.log ("Comment deletion in progress");
        for (let i = 0; i < userComments.length; i++) {
            const commentID = userComments[i];
            await deleteCommentById(commentID.id);
            //console.log("deleted comment");
        }
    }

    const uservotes = await db.all(SQL`SELECT voterID FROM votes WHERE voterID = ${id}`);
    //console.log (uservotes);
    if (uservotes != null || nestedID != undefined) {
        //console.log("Vote deletion in progress")
        await db.run(SQL`DELETE FROM votes WHERE voterID = ${id}`);
        //console.log("Deleted Votes");
    }

    return await db.run(SQL`DELETE FROM users WHERE id = ${id}`);
};

async function deleteCommentById(id) {
    const db = await dbPromise;
    const nestedID = await db.get(SQL`SELECT id FROM comments WHERE parentCommentID = ${id}`);
    //console.log("Running delete comment on id:");
    //console.log(id);
    //console.log("With nested id of");
    //console.log(nestedID);

        if (nestedID != null || nestedID != undefined) {
            //console.log("if block");
            const nestedID2 = await db.get(SQL`SELECT id FROM comments WHERE parentCommentID = ${nestedID.id}`);
            //console.log("found nested id of:");
            //console.log(nestedID2);
            if (nestedID2 != null || nestedID2 != undefined) {
                //console.log ("nested if, with id of:");
                //console.log (nestedID2.id);
                await deleteCommentById(`${nestedID2.id}`);
            }
            await db.run(SQL`DELETE FROM votes WHERE commentID = ${nestedID.id}`);
            await db.run(SQL`DELETE FROM comments WHERE id = ${nestedID.id}`);
            await db.run(SQL`DELETE FROM votes WHERE commentID = ${id}`);
            return await db.run(SQL`DELETE FROM comments WHERE id = ${id}`);
        } else {
            //console.log("else block");
            await db.run(SQL`DELETE FROM votes WHERE commentID = ${id}`);
            return await db.run(SQL`DELETE FROM comments WHERE id = ${id}`);
        }
};

async function addUpvoteByCommentId(id, userid) {
    const db = await dbPromise;
    await db.run(SQL`INSERT INTO votes (commentID, voterID) VALUES (${id}, ${userid});`);
    return await db.run(SQL`UPDATE comments SET upvotes = upvotes + 1 WHERE id = ${id}`);
};

async function addDownvoteByCommentId(id, userid) {
    const db = await dbPromise;
    await db.run(SQL`INSERT INTO votes (commentID, voterID) VALUES (${id}, ${userid});`);
    return await db.run(SQL`UPDATE comments SET downvotes = downvotes + 1 WHERE id = ${id}`);
};

async function deleteArticleById(id) {
    const db = await dbPromise;
    const articleComments = await db.all(SQL`SELECT id FROM comments WHERE articleID = ${id}`);
    //console.log("Running delete article comments with id:");
    //console.log(articleComments);
    for (let i = 0; i < articleComments.length; i++) {
        const commentID = articleComments[i];
        await deleteCommentById(commentID.id);
    }
    return await db.run(SQL`DELETE FROM articles WHERE id = ${id}`);
};

async function createUser(fname, lname, username, dob, password, description, imageSource) {
    const db = await dbPromise;
    return await db.run(SQL`INSERT INTO users (fname, lname, username, dob, password, description, imageSource) VALUES (${fname}, ${lname}, ${username}, ${dob}, ${password}, ${description}, ${imageSource})`);
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
    addDownvoteByCommentId
};
