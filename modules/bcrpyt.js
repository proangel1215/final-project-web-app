// Set up bcrypt for hashing and salting
//saltRounds = cost factor: controls how much time is needed to calculate a hash. The higher the cost factor, the more hashing rounds are done. Increasing the cost factor by 1 doubles the necessary time.
const bcrypt = require("bcrypt");
const saltRounds = 10;
const plainTextPassword1 = "hols757204-25783"; //test password

//this method hashes and salts the password
bcrypt
  .hash(plainTextPassword1, saltRounds)
  .then(hash => {
    console.log(`Hash: ${hash}`);
    // Store hash in your password DB.
  })
  .catch(err => console.error(err.message));

  //.compare method deduces the salt from the hash and is able to then hash the provided password correctly for comparison
  bcrypt
  .compare(plainTextPassword1, hash)
  .then(res => {
    console.log(res);
  })
  .catch(err => console.error(err.message));
  
module.exports = [
    bcrypt.hash,
    bcrypt.compare
]
