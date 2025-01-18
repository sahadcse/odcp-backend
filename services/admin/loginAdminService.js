const Admin = require('../../models/adminModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../utils/tokenGenerator');

const loginAdminService = async ({ email, password }) => {
    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new Error('Admin not found');
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    try {
        return {
            token: generateToken(admin._id),
            admin: admin,
        }
    } catch (error) {
        throw new Error(error, 'Error logging in admin Service');
    }
}

module.exports = loginAdminService;