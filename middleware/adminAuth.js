const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/adminModel');

const protectAdmin = async (req, res, next) => {
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

        // Validate admin ID
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            return res.status(401).send({ error: 'Invalid admin ID.' });
        }


        // Find admin by ID
        const admin = await Admin.findOne({ _id: decoded.id }).select('-password');
        if (!admin) {
            return res.status(401).send({ error: 'Admin not found.' });
        }

        // Attach token and admin to request object
        req.token = token;
        req.admin = admin;
        next();
        // console.log("Admin authenticated:", admin.email);
    } catch (error) {
        console.log("Error in protectAdmin:", error);
        res.status(401).send({
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please authenticate.',
        });
    }
};

module.exports = protectAdmin;