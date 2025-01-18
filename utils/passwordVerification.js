const bcrypt = require('bcryptjs');

async function verifyHashedPassword(enteredPassword, hashedPassword) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
}

module.exports = verifyHashedPassword;
