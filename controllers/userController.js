const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

// @desc    Register a new user (patient, doctor)
// @route   POST /api/users/register
// @access  Public

const registerUser = async (req, res) => {
    const { name, email, password, role, contactInfo, profilePicture, medicalHistory, specailization}= req.body;

    // check if all fields are filled
    if (!name || !email || !password || !role) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // check if user already exists
    const userExists = await User.findOne({email});
    if (userExists) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    // create new user
    const user = new User({
        name,
        email,
        password,
        role,
        contactInfo,
        profilePicture,
        medicalHistory,
        specailization: role === 'doctor' ? specailization : undefined,
    });

    
    // save user to database
    await user.save();

    // sent response with JWT token
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })

    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}


// @desc    Login a user
// @route   POST /api/users/login
// @access  Public

const loginUser = async (req, res) => {
    const { email, password }= req.body;

    // Check for user by email
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    } else {
        res.status(401).json({ msg: 'Invalid email or password' });
    }
}

// @desc Get user profile (Protected Route)
// @route GET /api/users/profile
// @access Private

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        })
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}


// @desc Update user profile (Protected Route)
// @route PUT /api/users/profile
// @access Private

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // If doctor, update specailization and availability
        if(user.role === 'doctor') {
            user.specailization = req.body.specailization || user.specailization;
            user.availability = req.body.availability || user.availability;
        }

        // If patient, update medical history
        if(user.role === 'patient') {
            user.medicalHistory = req.body.medicalHistory || user.medicalHistory;
        }

        if(req.body.password){
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            specailization: updatedUser.specailization,
            availability: updatedUser.availability,
            medicalHistory: updatedUser.medicalHistory,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };