const bcrypt = require("bcryptjs");

// Copy the hashed password from your database
const storedHash = "$2b$12$Tm2daDuGECYR/O.083mTj.PX91l2ia.drhu6Ylmg5mUzMr.b5jvcS"; // Replace this with your actual stored hash
const enteredPassword = "test_password"; // Replace this with the password you are entering in Postman

bcrypt.compare(enteredPassword, storedHash).then((result) => {
  console.log("Password matches:", result);
});