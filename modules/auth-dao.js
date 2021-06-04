const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 */
 async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        SELECT * FROM users
        WHERE username = ${username} AND password = ${password}`);

    return user;
}

/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 */
 async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        SELECT * FROM users
        WHERE authToken = ${authToken}`);

    return user;
}

/**
 * Updates the given user's auth token in the database
 */
 async function updateAuthToken(user) {
    const db = await dbPromise;

    await db.run(SQL`
        UPDATE users
        SET authToken = ${user.authToken}
        WHERE id = ${user.id}`);
}

/**
 * Gets the hashed and salted password for a given username
 * from the database. If the username does not exist,
 * undefined will be returned.
 */
async function retrieveHashByUsername(username) {
    const db = await dbPromise;
    return await db.get(SQL`SELECT password FROM users WHERE username = ${username}`);
}


module.exports = {
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    updateAuthToken,
    retrieveHashByUsername
};
