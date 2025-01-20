const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Patient = require('../models/patientModel');

// Middleware to authenticate patient
const patientAuth = async (req, res, next) => {
    try {
        // Check for Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({ error: 'Malformed token or no token provided.' });
        }

        // Extract token from header
        const token = authHeader.replace('Bearer ', '');
        // console.log("token:", token?.substring(0, 10) + '...');

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).send({ error: 'Invalid or expired token.' });
        }

        // Validate patient ID
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            return res.status(401).send({ error: 'Invalid patient ID.' });
        }

        // Find patient by ID
        const patient = await Patient.findOne({ _id: decoded.id });
        if (!patient) {
            console.log("Patient not found with id:", decoded.id);
            return res.status(401).send({ error: 'Patient not found.' });
        }

        // Attach token and patient to request object
        req.token = token;
        req.patient = patient;
        next();
    } catch (error) {
        res.status(401).send({
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please authenticate.',
        });
    }
};

module.exports = patientAuth;
