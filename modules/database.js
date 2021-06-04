// Imports the sqlite package
const sqlite = require("sqlite");

// Begins the process of opening the database file and returns a Promise
const dbPromise = sqlite.open("./project-database.db");

// Exports the promise, which can be used to run SQL
module.exports = dbPromise;