const registerDoctorService = require("../services/doctor/registerDoctor");
const getDoctorProfileService = require("../services/doctor/getDoctorProfile");
const updateDoctorProfileService = require("../services/doctor/updateDoctorProfile");
const deleteDoctorProfile = require("../services/doctor/deleteRequestDoctorProfile");
const loginDoctorService = require("../services/doctor/loginDoctor");
const hashPassword = require("../utils/hashPassword");

// Register a new doctor
const registerDoctor = async (req, res) => {
  const requiredFields = [
    "full_name",
    "email",
    "password",
    "phone_number",
    "date_of_birth",
    "gender",
    "address",
    "specialization",
    "qualifications",
    "experience_years",
    "license_number",
    "consultation_fee",
    "availability",
    "languages_spoken",
    "hospital_affiliations",
    "consent_form_signed",
    "terms_accepted",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ msg: `Please enter all fields. Missing: ${field}` });
    }
  }

  // hash password
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  try {
    const { token, doctor } = await registerDoctorService(req.body);
    res.status(201).json({ token, doctor });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(400).json({ msg: error.message });
  }
};

// Get doctor profile
const getDoctorProfile = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({ msg: "Doctor not Fetch correctly" });
  }
  try {
    const doctorProfile = await getDoctorProfileService(id);
    res.json(doctorProfile);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  const doctor = req.doctor;

  if (!doctor) {
    return res.status(401).json({ msg: "Doctor not Fetch correctly" });
  }

  const updatedData = {
    ...req.body,
    files: req.files,
  };

  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({ msg: "No update data received" });
  }

  try {
    const updatedDoctor = await updateDoctorProfileService(
      doctor._id,
      updatedData
    );
    res.json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Doctor login
const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  try {
    const { token, doctor } = await loginDoctorService(email, password);
    res.status(200).json({ token, doctor });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Delete Request for Doctor Profile to the admin
const deleteDoctorProfileRequest = async (req, res) => {
  const doctor = req.doctor;

  const { reason } = req.body;
  if (!reason) {
    return res
      .status(400)
      .json({ msg: "Please provide a reason for account deletion" });
  }

  if (!doctor) {
    return res.status(401).json({ msg: "Doctor not Fetch correctly" });
  }

  console.log("Doctor:", doctor);

  try {
    const doctorProfile = await deleteDoctorProfile(doctor, reason);
    res.json({
      msg: "Request for account deletion submitted successfully",
      doctorProfile,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  registerDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  deleteDoctorProfileRequest,
  loginDoctor,
};
