const Admin = require('../../models/adminModel');
const bcrypt = require('bcryptjs');

const updateAdminService = async (id, updates) => {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw new Error('Admin not found');
  }
  try {
    Object.keys(updates).forEach((update) => {
      if (updates[update] !== undefined) {
        admin[update] = updates[update];
      }
    });
    if (updates.password) {
      admin.password = await bcrypt.hash(updates.password, 10);
    }
    await admin.save();
    return updates; // Return only the updated fields
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = updateAdminService;