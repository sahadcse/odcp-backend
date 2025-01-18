const Patient = require("../../models/patientModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../utils/tokenGenerator");

const loginPatient = async (email, password) => {
  const patient = await Patient.findOne({ email });
  console.log(patient.email);

  if (!patient) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, patient.password);

  console.log(isMatch);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(patient._id);

  return { token, patient };
};

module.exports = loginPatient;
