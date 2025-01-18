const express = require("express");
const protectPatient = require("../middleware/patientAuth");
const { upload } = require("../config/cloudinaryConfig");
const { registerPatient, getPatientProfile, updatePatientProfile, deletePatientHandler, loginPatient } = require("../controllers/patientController");
const { bookAppointment, viewAppointments, getAppointmentDetails, cancelAppointment, rescheduleAppointment } = require("../controllers/appointmentPatientController");
const { viewConsultationHistory, getConsultationDetails, uploadMedicalReports, downloadPrescription, getNotifications } = require("../controllers/consultationPatientController");

const router = express.Router();

// Authentication--------------------------------------------------------------

// Register a new patient
router.post("/register", registerPatient);  // tested
// Patient login
router.post("/login", loginPatient);  // tested

// POST /api/patient/logout – Logout for patients.
// POST /api/patient/request-password-reset – Request password reset.
// POST /api/patient/reset-password – Reset password.

// Authentication--------------------------------------------------------------

// Profile Management----------------------------------------------------------

// Get patient profile
router.get("/profile", protectPatient, getPatientProfile); // tested
// Update patient profile
router.put(
  "/update",
  protectPatient,
  upload.fields([{ name: "profile_picture", maxCount: 1 }]),
  updatePatientProfile
); // tested
// Delete patient profile
router.delete("/delete", protectPatient, deletePatientHandler); // tested

// Profile Management----------------------------------------------------------

// Appointments----------------------------------------------------------------

// Book an appointment
router.post("/appointments", protectPatient, bookAppointment); // tested
// View all appointments for the patient
router.get("/appointments", protectPatient, viewAppointments);  // tested
// Get details of a specific appointment
router.get("/appointments/:appointmentId", protectPatient, getAppointmentDetails); // tested
// Cancel an appointment
router.put("/appointments/:appointmentId/cancel", protectPatient, cancelAppointment); // tested
// Reschedule an appointment
router.patch("/appointments/:id/reschedule", protectPatient, rescheduleAppointment ); // tested

// Appointments----------------------------------------------------------------

// Consultations---------------------------------------------------------------

// View consultation history
router.get("/consultations", protectPatient, viewConsultationHistory); // tested
// View details of a specific consultation
router.get("/consultations/:id", protectPatient, getConsultationDetails); // tested
// Upload medical reports for a consultation
router.post("/consultations/:id/files", protectPatient, upload.fields([{ name: "medical_reports", maxCount: 5 }]),uploadMedicalReports);  // tested
// Download prescription
router.get("/consultations/:id/prescription", protectPatient, downloadPrescription);  // tested

// Consultations---------------------------------------------------------------

// Notifications---------------------------------------------------------------

// Get notifications for the patient
router.get("/notifications", protectPatient, getNotifications); // tested

// Notifications---------------------------------------------------------------

module.exports = router;
