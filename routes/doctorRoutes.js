const express = require("express");
const protectDoctor = require("../middleware/doctorAuth");
const { upload } = require("../config/cloudinaryConfig");
// Importing the doctor controller functions
const {
  registerDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  deleteDoctorProfileRequest,
  loginDoctor,
} = require("../controllers/doctorController");
// Importing the appointment controller functions
const {
  viewAppointments,
  getAppointmentDetails,
  confirmAppointment,
  cancelAppointment,
  getNotifications,
  setAvailability,
  getAvailabilityDetails,
  modifyAvailability,
  deleteAvailability,
  getPatientDetails,
} = require("../controllers/appointmentDoctorController");
// Importing the consultation controller functions
const {
  viewConsultationHistory,
  getConsultationDetails,
  startConsultation,
  completeConsultation,
  uploadPrescription,
  cancelConsultation,
  totalPatients,
  getRoomName,
  getPatientDetailsForLive,
  getPatientFiles,
} = require("../controllers/consultationDoctorController");

const router = express.Router();

// Authentication---------------------------------------------------------

// Register a new doctor
router.post("/register", registerDoctor); // Tested
// Doctor login
router.post("/login", loginDoctor); // Tested

// POST /api/doctor/logout – Logout for doctors.
// POST /api/doctor/request-password-reset – Request password reset.
// POST /api/doctor/reset-password – Reset password.

// Authentication---------------------------------------------------------

// Profile Management-----------------------------------------------------

// Get doctor profile
router.get("/profile/:id", protectDoctor, getDoctorProfile); // Tested
// Update doctor profile
router.put(
  "/update",
  protectDoctor,
  upload.fields([
    { name: "profile_picture_url", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  updateDoctorProfile
); // Tested
// Delete doctor profile
router.delete("/delete", protectDoctor, deleteDoctorProfileRequest); // Tested

// Profile Management-----------------------------------------------------

// Appointments-----------------------------------------------------------

// View all appointments for the doctor
router.get("/appointments", protectDoctor, viewAppointments); // Tested
// Get details of a specific appointment
router.get("/appointments/:id", protectDoctor, getAppointmentDetails); // Tested
// Confirm an appointment
router.put("/appointments/:id/confirm", protectDoctor, confirmAppointment); // Tested
// Cancel an appointment
router.put("/appointments/:id/cancel", protectDoctor, cancelAppointment); // Tested

// get patient details for a specific appointment
router.get("/appointments/:id/patient", protectDoctor, getPatientDetails); // Tested

// Appointments-----------------------------------------------------------

// Consultations----------------------------------------------------------

// View consultation history
router.get("/consultations", protectDoctor, viewConsultationHistory); // Tested
// View details of a specific consultation
router.get("/consultations/:id", protectDoctor, getConsultationDetails); // Tested
// Start a consultation
router.post("/consultations/:id/start", protectDoctor, startConsultation); // Tested
// Mark consultation as completed
router.post("/consultations/:id/complete", protectDoctor, completeConsultation); // Tested
// Upload a prescription
router.post(
  "/consultations/:id/prescription",
  protectDoctor,
  uploadPrescription
); // Tested
// cancel a consultation
router.put("/consultations/:id/cancel", protectDoctor, cancelConsultation); // Tested

// Get the number of patients a doctor has based on consultations
router.get("/consultations/patients/count", protectDoctor, totalPatients); // Tested

// Get Room Info for consultation
router.get("/consultations/room/collect/:id", protectDoctor, getRoomName); // Tested

// Get a specific patient using the consultation id
router.get(
  "/consultations/patient/:id",
  protectDoctor,
  getPatientDetailsForLive
); // Tested

// Consultations----------------------------------------------------------

// get all files uploaded by the specific patient
router.get("/consultations/:patient_id/files", protectDoctor, getPatientFiles); // Tested

// Notifications----------------------------------------------------------

// Get notifications for the doctor
router.get("/notifications", protectDoctor, getNotifications); // Tested

// Notifications----------------------------------------------------------

// Availability Management-----------------------------------------------

// Set availability
router.post("/availability/create", protectDoctor, setAvailability); // Tested
// Update availability
router.put("/availability/:id/update", protectDoctor, modifyAvailability); // Tested
// Delete availability
router.delete(
  "/availability/:availabilityId/delete",
  protectDoctor,
  deleteAvailability
); // Tested
// Get availability details
router.get("/availability", protectDoctor, getAvailabilityDetails); // Tested

// Availability Management-----------------------------------------------

module.exports = router;
