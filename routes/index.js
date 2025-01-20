const router = require('express').Router();
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./_/appointmentRoutes');
const consultationRoutes = require('./_/consultationRoutes');
const adminRoutes = require('./adminRoutes');
const patientRoutes = require('./patientRoutes');

// Doctor routes
router.use('/api/users/doctor', doctorRoutes);   // Tested

// Patient routes
/**
 * @route /api/users/patient
 * @desc Routes for patient-related operations
 */
router.use('/api/users/patient', patientRoutes);  // Tested	

// Admin routes
router.use('/api/admins', adminRoutes);

// router.use('/api/appointments', appointmentRoutes);
// router.use('/api/consultations', consultationRoutes);

module.exports = router;