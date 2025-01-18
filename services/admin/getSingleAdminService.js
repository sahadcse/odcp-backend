const Admin = require('../../models/adminModel');

const getAdminByIdService = async (id) => {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw new Error('Admin not found');
  }
  return admin;
};

module.exports = getAdminByIdService;