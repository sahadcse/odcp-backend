
const Admin = require('../../models/adminModel');

const deleteAdminService = async (id) => {
  const admin = await Admin.findById(id);
  if (!admin) {
    return {
      message: 'Admin not found',
    }
  }
  await Admin.findByIdAndDelete(id);
  return {
    message: 'Admin deleted successfully',
    admin,
  }
};

module.exports = deleteAdminService;