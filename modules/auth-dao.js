const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 */
 async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username} and password = ${password}`);

    return user;
}

/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 */
 async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where authToken = ${authToken}`);

    return user;
}

/**
 * Updates the given user in the database, not including auth token
 */
 async function updateAuthToken(user) {
    const db = await dbPromise;

    await db.run(SQL`
        update users
        set authToken = ${user.authToken}
        where id = ${user.id}`);
}

async function retrieveHashByUsername(username) {
    const db = await dbPromise;
    return await db.get(SQL`select password from users where username = ${username}`);
}

module.exports = {
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    updateAuthToken,
    retrieveHashByUsername
};
