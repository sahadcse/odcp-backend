const Patient = require("../../models/patientModel");

const updatePatient = async (id, patientData) => {
  const patient = await Patient.findById(id);
  if (!patient) {
    return null; // Return null to indicate patient not found
  }

  const updatedFields = {};
  // Update patient fields
  Object.keys(patientData).forEach((key) => {
    if (patientData[key] !== undefined && patient[key] !== patientData[key]) {
      patient[key] = patientData[key];
      updatedFields[key] = patientData[key];
    }
  });

  if (
    patientData.profile_picture !== undefined &&
    patient.profile_picture !== patientData.profile_picture
  ) {
    patient.profile_picture = patientData.profile_picture;
    updatedFields.profile_picture = patientData.profile_picture;
  }

  await patient.save();
  return updatedFields;
};

module.exports = updatePatient;
