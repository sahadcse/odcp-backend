const User = require("../models/_/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { upload } = require("../config/cloudinaryConfig");

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Helper function to extract public IDs from Cloudinary URLs
const extractPublicId = (url) => {
  const parts = url.split("/");
  const publicIdWithExtension = parts[parts.length - 1];
  const publicId = publicIdWithExtension.split(".")[0];
  return publicId;
};

// Middleware to validate and upload files during registration
const registerValidate = async (req, res, next) => {
  const { name, email, password, role, age, sex } = req.body;

  console.log("Req.Body1:", req.body); // Debugging log

  // Validate required fields
  if (!name || !email || !password || !role || !age || !sex) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ msg: "User already exists" });
  }

  next();
};

// @desc    Register a new user (patient, doctor)
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    contactInfo,
    specialization,
    availableSlots,
    availability,
    doctorId,
    authorizedOrganization,
    age,
    sex,
  } = req.body;

  try {
    // create new user
    const user = new User({
      name,
      email,
      password,
      role,
      contactInfo,
      specialization: role === "doctor" ? specialization : undefined,
      availableSlots: role === "doctor" ? availableSlots : undefined,
      availability: role === "doctor" ? availability : undefined,
      doctorId: role === "doctor" ? doctorId : undefined,
      authorizedOrganization:
        role === "doctor" ? authorizedOrganization : undefined,
      age,
      sex,
    });

    // save user to database
    await user.save();

    // sent response with JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    const msg =
      process.env.NODE_ENV === "development"
        ? error.message
        : "Invalid user data -Registration failed";
    res.status(400).json({ msg });
  }
};

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user by email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ msg: "Invalid email or password" });
  }
};

// @desc Get user profile (Protected Route)
// @route GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log("check-", user)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      contactInfo: user.contactInfo,
      age: user.age,
      sex: user.sex,
      specialization: user.specialization,
      availableSlots: user.availableSlots,
      availability: user.availability,
      doctorId: user.doctorId,
      authorizedOrganization: user.authorizedOrganization,
      token: generateToken(user._id),
    })
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc Update user profile (Protected Route)
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.contactInfo = req.body.contactInfo || user.contactInfo;
    user.age = req.body.age || user.age;
    user.sex = req.body.sex || user.sex;

    // Handle file uploads
    const profilePictureUrl =
      req.files && req.files.profileImg
        ? req.files.profileImg[0].path
        : user.profilePicture;
    const validPapersUrls =
      req.files && req.files.doctorValidPapers
        ? req.files.doctorValidPapers.map((file) => file.path)
        : user.validPapers;

    user.profilePicture = profilePictureUrl;
    user.validPapers = validPapersUrls;

    // If doctor, update specialization, availableSlots, availability, doctorId, authorizedOrganization
    if (user.role === "doctor") {
      user.specialization = req.body.specialization || user.specialization;
      user.availableSlots = req.body.availableSlots || user.availableSlots;
      user.availability = req.body.availability || user.availability;
      user.doctorId = req.body.doctorId || user.doctorId;
      user.authorizedOrganization =
        req.body.authorizedOrganization || user.authorizedOrganization;
    }

    // If patient, update medical history
    if (user.role === "patient") {
      user.medicalHistory = req.body.medicalHistory || user.medicalHistory;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      contactInfo: updatedUser.contactInfo,
      profilePicture: updatedUser.profilePicture,
      age: updatedUser.age,
      sex: updatedUser.sex,
      specialization: updatedUser.specialization,
      availableSlots: updatedUser.availableSlots,
      availability: updatedUser.availability,
      doctorId: updatedUser.doctorId,
      authorizedOrganization: updatedUser.authorizedOrganization,
      validPapers: updatedUser.validPapers,
      medicalHistory: updatedUser.medicalHistory,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  registerValidate,
};
