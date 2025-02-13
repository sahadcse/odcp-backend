const Patient = require("../../models/patientModel");
const {generatePatientId} = require("../../utils/idGenerator")
const { generateToken } = require("../../utils/tokenGenerator");

const createPatient = async (patientData) => {
  if (!patientData) {
    throw new Error("Missing required fields");
  }

  try {
    // existing patient check
    const existingPatient = await Patient.findOne({ email: patientData.email });
    if (existingPatient) {
      throw new Error("Patient already exists");
    }

    patientData.patient_id = await generatePatientId();

    const newPatient = new Patient(patientData);
    await newPatient.save();
    return {
      token: generateToken(newPatient._id),
      patient: newPatient,
    };
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      throw new Error(messages.join(', '));
    }
    throw new Error(error.message);
  }
};

module.exports = createPatient;
