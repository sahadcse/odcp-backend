const createPatient = require("../services/patient/createPatient");
const getPatientById = require("../services/patient/getPatientById");
const updatePatient = require("../services/patient/updatePatient");
const deleteRequestPatientProfile = require("../services/patient/deleteRequestPatientProfile");
const loginPatientService = require("../services/patient/loginPatient");
const hashPassword = require("../utils/hashPassword");
const Patient = require("../models/patientModel");

// Create a new patient
/**
 * @desc Register a new patient
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const registerPatient = async (req, res) => {
  const patientField = [ "full_name", "email", "password", "phone_number", "date_of_birth", "gender", "blood_group", "height", "weight", "emergency_contact", "terms_accepted", "consent_form_signed"];

  const isValidOperation = patientField.every((field) => req.body[field]);
  if (!isValidOperation) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    req.body.password = await hashPassword(req.body.password);
    const patient = await createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get patient by ID
/**
 * @desc Get patient profile by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getPatientProfile = async (req, res) => {
  try {
    const patient = await getPatientById(req.patient._id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update patient profile
/**
 * @desc Update patient profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updatePatientProfile = async (req, res) => {
  // get patient from request
  const patient = req.patient;
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  const updateData = { ...req.body };

  if (req.files && req.files.profile_picture) {
    updateData.profile_picture = req.files.profile_picture[0].path;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const updatedPatient = await updatePatient(req.patient._id, updateData);
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const storeMedicalReports = async (req, res) => {
  const patient = req.patient;
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  if (!req.files.medical_reports) {
    return res.status(400).json({ message: "No medical reports found" });
  }

  // Validate medical report types
  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
  const invalidFiles = req.files.medical_reports.filter(file => !allowedTypes.includes(file.mimetype));
  
  if (invalidFiles.length > 0) {
    return res.status(400).json({ message: "Invalid file type. Only PNG, JPEG, and PDF files are allowed." });
  }

  const newMedicalReports = req.files.medical_reports.map((file) => ({
    type: file.mimetype,
    url: file.path,
  }));

  try {
    const currentPatient = await Patient.findById(patient._id);
    const existingReports = currentPatient.medical_reports || [];
    const updatedReports = [...existingReports, ...newMedicalReports];

    currentPatient.medical_reports = updatedReports;
    const updatedPatient = await currentPatient.save();

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete patient profile
/**
 * @desc Delete patient profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deletePatientHandler = async (req, res) => {
    const patient = req.patient;

    const { reason } = req.body;
    if (!reason) {
        return res.status(400).json({ msg: "Please provide a reason for account deletion" });
    }

    if (!patient) {
        return res.status(401).json({ msg: "Patient not Fetch correctly" });
    }

    console.log("Patient:", patient);

    try {
        const patientProfile = await deleteRequestPatientProfile(patient, reason);
        res.json(patientProfile);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// Patient login
/**
 * @desc Login a patient
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  try {
    const { token, patient } = await loginPatientService(email, password);
    res.status(200).json({ token, patient });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  registerPatient,
  getPatientProfile,
  updatePatientProfile,
  deletePatientHandler,
  loginPatient,
  storeMedicalReports
};
