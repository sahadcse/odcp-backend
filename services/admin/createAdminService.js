const Admin = require('../../models/adminModel');
const { generateAdminId } = require('../../utils/idGenerator');
const { generateToken } = require('../../utils/tokenGenerator');
const hashPassword = require('../../utils/hashPassword');

const createAdminService = async (inputData) => {
    const { email } = inputData;
    const findAdmin = await Admin.findOne({ email });
    if (findAdmin) {
        return {
            error: 'Admin already exists',
        };
    }
    
    try {
        inputData.password = await hashPassword(inputData.password);
        const admin_id = await generateAdminId();
        inputData.admin_id = admin_id;
        const admin = new Admin(inputData);
        await admin.save();
        return {
            token: generateToken(admin._id),
            admin: admin,
        };
    }  catch (error) {
        console.error("Error during admin save:", error.message);
        if (error.errors) console.error("Validation details:", error.errors);
        throw new Error(`Error creating admin: ${error.message}`);
    }
};

module.exports = createAdminService;

