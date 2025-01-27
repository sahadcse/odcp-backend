const express = require('express');
const Doctor = require('../models/doctorModel');

const router = express.Router();

// Route to get all doctors
router.get('/doctor/all', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;