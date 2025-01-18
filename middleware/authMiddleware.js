const jwt = require('jsonwebtoken');
const User = require('../models/_/userModel');

const protect = async (req, res, next) => {
    let token;

    console.log("from auth:", req.user);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Attach the authenticated user to the request object
            req.user = await User.findById(decoded.id).select('-password');
            next(); // Move to the next middleware
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
}

module.exports = protect;