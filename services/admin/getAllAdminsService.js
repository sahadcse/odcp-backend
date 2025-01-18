const Admin = require('../../models/adminModel');

const getAllAdmins = async () => {
  return await Admin.find();
};

module.exports = getAllAdmins;