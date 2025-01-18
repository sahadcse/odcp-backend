const Patient = require("../../models/patientModel");

const getPatientById = async (id) => {
  return await Patient.findById(id);
};

module.exports = getPatientById;