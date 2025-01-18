const bcrypt = require('bcryptjs');


async function hashPassword(plainTextPassword) {
    const saltRounds = 10;

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        throw new Error('Invalid password input');
    }

    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error in hashPassword:', error.message);
        throw new Error('Error hashing password');
    }
}

module.exports = hashPassword;
