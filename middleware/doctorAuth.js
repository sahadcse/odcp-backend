const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Doctor = require('../models/doctorModel');

const protectDoctor = async (req, res, next) => {
    try {
        // Check for Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send({ error: 'Malformed token or no token provided.' });
        }

        // Extract token from header
        const token = authHeader.replace('Bearer ', '');
        console.log("token:", token?.substring(0, 10) + '...');

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).send({ error: 'Invalid or expired token.' });
        }

        // Validate doctor ID
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            return res.status(401).send({ error: 'Invalid doctor ID.' });
        }

        // Find doctor by ID
        const doctor = await Doctor.findOne({ _id: decoded.id }).select('-password');
        if (!doctor) {
            console.log("Doctor not found with id:", decoded.id);
            return res.status(401).send({ error: 'Doctor not found.' });
        }

        // Attach token and doctor to request object
        req.token = token;
        req.doctor = doctor;
        next();
    } catch (error) {
        res.status(401).send({
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please authenticate.',
        });
    }
};

module.exports = protectDoctor;
