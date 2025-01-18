const mongoose = require('mongoose');
const Doctor = require('./doctorModel');
const Patient = require('./patientModel');

const accountDeletionRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel', // Can reference both doctors and patients
    required: true,
  },
  userTypeId: {
    type: String,
    refPath: 'userModel', // Reference to the user type
    required: true,
  },
  userModel: {
    type: String,
    enum: ['Doctor', 'Patient'], // Specify the user Model
    required: true,
  },
  reason: {
    type: String,
    required: true,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'], // Current status of the request
    default: 'pending',
  },
  adminResponse: {
    type: String, // Optional field for admin to provide response
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AccountDeletionRequest', accountDeletionRequestSchema);
