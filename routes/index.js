const router = require('express').Router();
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./_/appointmentRoutes');
const consultationRoutes = require('./_/consultationRoutes');
const adminRoutes = require('./adminRoutes');
const patientRoutes = require('./patientRoutes');

router.use('/api/users/doctor', doctorRoutes);   // Tested
router.use('/api/users/patient', patientRoutes);  // Tested	
router.use('/api/admins', adminRoutes);
// router.use('/api/appointments', appointmentRoutes);
// router.use('/api/consultations', consultationRoutes);


module.exports = router