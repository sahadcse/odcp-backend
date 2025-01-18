const express = require('express');
const {requestAppointment, getDoctorAppointments, getPatientAppointments, updateAppointmentStatus} = require('../../controllers/unused/appointmentController');
const protect = require('../../middleware/authMiddleware');

const router = express.Router();

// Patient requests an appointment
router.post('/', protect, requestAppointment);

// Get all appointments for doctor
router.get('/doctor', protect, getDoctorAppointments);

// Get all appointments for patient
router.get('/patient', protect, getPatientAppointments);

// Update appointment status (Doctor confirms/rejects)
router.put('/:id/status', protect, updateAppointmentStatus);


module.exports = router;