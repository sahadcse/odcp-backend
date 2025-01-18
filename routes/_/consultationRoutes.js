const router = require('express').Router();
const {getConsultationDetails, uploadPrescription, completeConsultation,  getPatientConsultationHistory, getDoctorConsultationHistory, downloadPrescription} = require('../../controllers/unused/consultationController');
const protect = require('../../middleware/authMiddleware');

// router.post('/', protect, createConsultation);
// router.put('/:id', protect, updateConsultation);

// Get consultation details by appointment ID
router.get('/:id', protect, getConsultationDetails);

// Uload a prescription for a completed consultation
router.put('/:id/prescription', protect, uploadPrescription);

// Mark consultation as completed
router.put('/:id/complete', protect, completeConsultation);

// Get consultation history for patient
router.get('/patient/history', protect, getPatientConsultationHistory);

// Get consultation history for doctor
router.get('/doctor/history', protect, getDoctorConsultationHistory);

// Download prescription
router.get('/:id/prescription', protect, downloadPrescription);

module.exports = router;