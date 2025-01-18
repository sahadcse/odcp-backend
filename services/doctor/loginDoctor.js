const Doctor = require("../../models/doctorModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../utils/tokenGenerator");

const loginDoctor = async (email, password) => {
  const doctor = await Doctor.findOne({ email });

  if (!doctor) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, doctor.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(doctor._id);

  return { token, doctor };
};

module.exports = loginDoctor;
