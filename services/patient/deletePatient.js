const Patient = require("../../models/patientModel");

const deletePatient = async (id) => {
  return await Patient.findByIdAndDelete(id);
};

module.exports = deletePatient;
