const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, registerValidate } = require('../../controllers/userController');
const protect = require('../../middleware/authMiddleware');
const { upload } = require('../../config/cloudinaryConfig');

const router = express.Router();

// Register a new user with profile image and doctor valid papers
router.post('/register', registerValidate, registerUser);

// Login a user
router.post('/login', loginUser);

// Get user profile (Protected Route)
router.get('/profile', protect, getUserProfile);

// Update user profile (Protected Route)
router.put('/profile', protect, upload.fields([
    { name: 'profileImg', maxCount: 1 },
    { name: 'doctorValidPapers', maxCount: 5 }
]), updateUserProfile);

module.exports = router;