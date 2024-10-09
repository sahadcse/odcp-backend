const express = require('express');
const {registerUser, loginUser, getUserProfile, updateUserProfile} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Get user profile (Protected Route)
router.get('/profile', protect, getUserProfile);

// Update user profile (Protected Route)
router.put('/profile', protect, updateUserProfile);

module.exports = router;