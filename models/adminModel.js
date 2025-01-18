const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  admin_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_picture: {
    type: String,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'], // Superadmin has full access, Admin has limited access
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  // Permissions Control
  permissions: {
    manageDoctors: { type: Boolean, default: false },
    managePatients: { type: Boolean, default: false },
    manageAppointments: { type: Boolean, default: false },
    managePrescriptions: { type: Boolean, default: false },
    managePayments: { type: Boolean, default: false },
    manageNotifications: { type: Boolean, default: false },
    manageReports: { type: Boolean, default: false },
    manageSettings: { type: Boolean, default: false },
    viewLogs: { type: Boolean, default: false },
    manageAccountDeletionRequests: { type: Boolean, default: false },
  },

  // Logs for Admin Actions
  logs: [
    {
      action: { type: String },
      timestamp: { type: Date, default: Date.now },
      details: { type: String },
    },
  ],

  // Session Management
  // tokens: [
  //   {
  //     token: {
  //       type: String,
  //     },
  //     createdAt: {
  //       type: Date,
  //       default: Date.now,
  //     },
  //   },
  // ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model('Admin', adminSchema);