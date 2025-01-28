const express = require("express");
const protectPatient = require("../middleware/patientAuth");
const { upload } = require("../config/cloudinaryConfig");
const {
  registerPatient,
  getPatientProfile,
  updatePatientProfile,
  deletePatientHandler,
  loginPatient,
  storeMedicalReports,
} = require("../controllers/patientController");
const {
  bookAppointment,
  getDoctors,
  viewAppointments,
  getAppointmentDetails,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorDetails,
} = require("../controllers/appointmentPatientController");
const {
  viewConsultationHistory,
  getConsultationDetails,
  uploadMedicalReports,
  downloadPrescription,
  getNotifications,
  getRoom,
} = require("../controllers/consultationPatientController");

const router = express.Router();

// Authentication--------------------------------------------------------------

// Register a new patient
/**
 * @route POST /api/users/patient/register
 * @desc Register a new patient
 * @access Public
 * @body { full_name, email, password, phone_number, date_of_birth, gender, blood_group, height, weight, emergency_contact, terms_accepted, consent_form_signed }
 */
router.post("/register", registerPatient); // tested

// Patient login
/**
 * @route POST /api/users/patient/login
 * @desc Login a patient
 * @access Public
 * @body { email, password }
 */
router.post("/login", loginPatient); // tested

// POST /api/patient/logout – Logout for patients.
// POST /api/patient/request-password-reset – Request password reset.
// POST /api/patient/reset-password – Reset password.

// Authentication--------------------------------------------------------------

// Profile Management----------------------------------------------------------

// Get patient profile
/**
 * @route GET /api/users/patient/profile
 * @desc Get patient profile
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.get("/profile", protectPatient, getPatientProfile); // tested

// Update patient profile
/**
 * @route PUT /api/users/patient/update
 * @desc Update patient profile
 * @access Private
 * @header Authorization: Bearer <token>
 * @body { profile_picture, ...other fields to update }
 */
router.put(
  "/update",
  protectPatient,
  upload.fields([{ name: "profile_picture", maxCount: 1 }]),
  updatePatientProfile
); // tested

// Store new medical reports
/**
 * @route POST /api/users/patient/medical-reports
 * @desc Store new medical reports
 * @access Private
 * @header Authorization
 * @body { medical_reports }
 */
router.post(
  "/medical-reports",
  protectPatient,
  upload.fields([{ name: "medical_reports", maxCount: 5 }]),
  storeMedicalReports
); // tested

// Delete patient profile
/**
 * @route DELETE /api/users/patient/delete
 * @desc Delete patient profile
 * @access Private
 * @header Authorization: Bearer <token>
 * @body { reason }
 */
router.delete("/delete", protectPatient, deletePatientHandler); // tested

// Profile Management----------------------------------------------------------

// Appointments----------------------------------------------------------------

// Book an appointment
/**
 * @route POST /api/users/patient/appointments
 * @desc Book an appointment
 * @access Private
 * @header Authorization: Bearer <token>
 * @body { appointment details }
 */
router.post(
  "/appointments",
  protectPatient,
  upload.fields([{ name: "filesData", maxCount: 5 }]),
  bookAppointment
); // tested

// Get all doctors for booking an appointment
/**
 * @route GET /api/users/patient/doctors
 * @desc Get all doctors for booking an appointment
 * @access Private
 * @header Authorization: Bearer <token>
 * @body { appointment details }
 */
router.get("/doctors", protectPatient, getDoctors); // tested

// View all appointments for the patient
/**
 * @route GET /api/users/patient/appointments
 * @desc View all appointments for the patient
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.get("/appointments", protectPatient, viewAppointments); // tested

// Get details of a specific appointment
/**
 * @route GET /api/users/patient/appointments/:appointmentId
 * @desc Get details of a specific appointment
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.get(
  "/appointments/:appointmentId",
  protectPatient,
  getAppointmentDetails
); // tested

// Cancel an appointment
/**
 * @route PUT /api/users/patient/appointments/:appointmentId/cancel
 * @desc Cancel an appointment
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.put(
  "/appointments/:appointmentId/cancel",
  protectPatient,
  cancelAppointment
); // tested

// Reschedule an appointment
/**
 * @route PATCH /api/users/patient/appointments/:id/reschedule
 * @desc Reschedule an appointment
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.patch(
  "/appointments/:id/reschedule",
  protectPatient,
  rescheduleAppointment
); // tested

// get Doctor details for a specific appointment
/**
 * @route GET /api/users/patient/appointments/:id/doctor
 * @desc get Doctor details for a specific appointment
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.get("/appointments/:id/doctor", protectPatient, getDoctorDetails); // tested

// Appointments----------------------------------------------------------------

// Consultations---------------------------------------------------------------

// View consultation history
/**
 * @route GET /api/users/patient/consultations
 * @desc View consultation history
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.get("/consultations", protectPatient, viewConsultationHistory); // tested

// View details of a specific consultation
/**
 * @route GET /api/users/patient/consultations/:id
 * @desc View details of a specific consultation
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.get("/consultations/:id", protectPatient, getConsultationDetails); // tested

// Upload medical reports for a consultation
/**
 * @route POST /api/users/patient/consultations/:id/files
 * @desc Upload medical reports for a consultation
 * @access Private
 * @header Authorization: Bearer <token>
 * @body { medical_reports }
 */
router.post(
  "/consultations/:id/files",
  protectPatient,
  upload.fields([{ name: "medical_reports", maxCount: 5 }]),
  uploadMedicalReports
); // tested

// Download prescription
/**
 * @route GET /api/users/patient/consultations/:id/prescription
 * @desc Download prescription
 * @access Private
 * @header Authorization: Bearer <token>
 */
// router.get(
//   "/consultations/:id/prescription",
//   protectPatient,
//   downloadPrescription
// ); // tested

// Get Room for joining the consultation
router.get("/consultations/join/:id", protectPatient, getRoom); // tested

// Consultations---------------------------------------------------------------

// Notifications---------------------------------------------------------------

// Get notifications for the patient
/**
 * @route GET /api/users/patient/notifications
 * @desc Get notifications for the patient
 * @access Private
 * @header Authorization: Bearer <token>
 */
router.get("/notifications", protectPatient, getNotifications); // tested

// Notifications---------------------------------------------------------------

module.exports = router;
