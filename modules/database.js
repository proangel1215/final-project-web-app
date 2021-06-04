/**
 * Begins the process of opening the database file and returns a Promise,
 * which is exported and can be used to run SQL
 */
const sqlite = require("sqlite");
const dbPromise = sqlite.open("./project-database.db");
module.exports = dbPromise;