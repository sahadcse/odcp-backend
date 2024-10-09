const router = require('express').Router();
const userRoutes = require('./userRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const consultationRoutes = require('./consultationRoutes');

router.use('/api/users', userRoutes);
router.use('/api/appointments', appointmentRoutes);
router.use('/api/consultations', consultationRoutes);


module.exports = router 