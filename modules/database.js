const sqlite = require("sqlite");
const dbPromise = sqlite.open("./project-database.db");
module.exports = dbPromise;