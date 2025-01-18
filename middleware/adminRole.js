const Admin = require('../models/adminModel');

const adminRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            if (typeof requiredRole !== 'string') {
                return res.status(400).send({ error: 'Invalid role type' });
            }
            const admin = await Admin.findById(req.admin.id);
            if (!admin) {
                return res.status(404).send({ error: 'Admin not found' });
            }
            if (admin.role !== requiredRole) {
                return res.status(403).send({ error: 'You\'re Not authorized to access the Route' });
            }
            next();
        } catch (error) {
            res.status(500).json({ error: error.message, message: 'Error in adminRole middleware'});
        }
    };
};

module.exports = adminRole;
