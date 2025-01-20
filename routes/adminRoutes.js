const express = require('express');
const router = express.Router();
const protectAdmin = require('../middleware/adminAuth');
const { upload } = require('../config/cloudinaryConfig');
const {createAdmin, loginAdmin, getAllAdmins, updateAdmin, deleteAdmin, getAdminById} = require('../controllers/adminController');
const adminRole = require('../middleware/adminRole');
const { allPatients, getPatientDetails, blockPatient, unblockPatient, approvePatientDeletion } = require('../controllers/admin/patientController@ADM');
const { listDoctors, getDoctorDetails, approveDoctor, rejectDoctor, blockDoctor, unblockDoctor, approveDoctorDeletion } = require('../controllers/admin/doctorController@ADM');
const { viewAppointments, viewAppointmentDetails, cancelAppointment } = require('../controllers/admin/appointmentController@ADM');
const { viewConsultations, viewConsultationDetails } = require('../controllers/admin/consultationController@ADM');
const { sendNotifications } = require('../controllers/admin/notificationController@ADM');
const { generateReports, viewAnalytics } = require('../controllers/admin/reportController@ADM');
const { createSettings, deleteSettings, updateSettings, viewSettings } = require('../controllers/admin/settingsController@ADM');
const { getAccountDeletionRequests } = require('../controllers/admin/commonController@ADM');



// Authentication-----------------------------------------------------

// Create a new admin
router.post('/admin/register', protectAdmin, adminRole('superadmin'), createAdmin);  // checked
// Admin login
router.post('/admin/login', loginAdmin); // checked

// POST /admin/logout – Logout for admins.

// Get all admins
router.get('/admin/get_all', protectAdmin, adminRole('superadmin'), getAllAdmins); // checked

// Get a specific admin by ID
router.get('/admin/:id', protectAdmin, getAdminById); // checked

// Update an admin by ID
router.patch('/admin/update/:id', protectAdmin, 
    upload.fields([{ name: 'profile_picture', maxCount: 1 }]), updateAdmin);  // checked

// Delete an admin by ID
router.delete('/admin/delete/:id', protectAdmin,adminRole('superadmin'), deleteAdmin);  // checked

// Authentication-----------------------------------------------------

// Account Deletion---------------------------------------------------

router.get('/admin/getaccount/deletion', protectAdmin, getAccountDeletionRequests);

// Account Deletion---------------------------------------------------

// Manage Patients----------------------------------------------------

// List all patients
router.get('/admin/patients/all', protectAdmin, allPatients); // checked

// Get patient details
router.get('/admin/patients/:id', protectAdmin, getPatientDetails); // checked

// Block a patient
router.put('/admin/patients/:id/block', protectAdmin, blockPatient); // checked

// Unblock a patient
router.put('/admin/patients/:id/unblock', protectAdmin, unblockPatient); // checked

// Approve patient account deletion
router.delete('/admin/patients/:id/delete', protectAdmin, approvePatientDeletion);  // checked

// Manage Patients----------------------------------------------------

// Manage Doctors----------------------------------------------------

// List all doctors
router.get('/admin/doctors/all', protectAdmin, listDoctors);    // checked

// Get doctor details
router.get('/admin/doctors/:id', protectAdmin, getDoctorDetails);   // checked

// Approve a doctor registration
router.put('/admin/doctors/:id/approve', protectAdmin, approveDoctor); // checked

// Reject a doctor registration
router.put('/admin/doctors/:id/reject', protectAdmin, rejectDoctor); // checked

// Block a doctor
router.put('/admin/doctors/:id/block', protectAdmin, blockDoctor); // checked

// Unblock a doctor
router.put('/admin/doctors/:id/unblock', protectAdmin, unblockDoctor); // checked

// Approve doctor account deletion
router.delete('/admin/doctors/:id/delete', protectAdmin, approveDoctorDeletion);    // checked

// Manage Doctors----------------------------------------------------

// Manage Appointments------------------------------------------------

// View all appointments
router.get('/admin/appointments/all', protectAdmin, viewAppointments);  // checked

// View specific appointment details
router.get('/admin/appointments/:id/view', protectAdmin, viewAppointmentDetails);   // checked

// Cancel an appointment on behalf of a user
router.delete('/admin/appointments/:id/cancel', protectAdmin, cancelAppointment);   // checked

// Manage Consultations-----------------------------------------------

// View all consultations
router.get('/admin/consultations/all', protectAdmin, viewConsultations);    // checked

// View details of a specific consultation
router.get('/admin/consultations/:id/view', protectAdmin, viewConsultationDetails); // checked

// Manage Notifications----------------------------------------------

// Send notifications to doctors or patients
router.post('/admin/notifications', protectAdmin, sendNotifications); // checked

// Manage Analytics & Reports----------------------------------------

// Generate system usage reports (appointments, consultations, etc.)
router.get('/admin/reports', protectAdmin, generateReports);

// View system-wide analytics
router.get('/admin/analytics', protectAdmin, viewAnalytics);

// Manage Platform Settings------------------------------------------

// Update platform configurations
router.put('/admin/settings', protectAdmin, updateSettings);

// View platform settings
router.get('/admin/settings', protectAdmin, viewSettings);

// create platform settings
router.post('/admin/settings', protectAdmin, createSettings);

// delete platform settings
router.delete('/admin/settings', protectAdmin, deleteSettings);

// Manage Platform Settings------------------------------------------

module.exports = router;


