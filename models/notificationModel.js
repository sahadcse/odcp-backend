const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
      refPath: 'recipientType', // Dynamic reference to either 'Patient' or 'Doctor'
    },
    recipientType: {
      type: String,
      required: true,
      enum: ['Patient', 'Doctor'], // Ensures only valid recipient types
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
      default: null, // Optional link for actionable notifications
    },
    type: {
      type: String,
      required: true,
      enum: ['Appointment', 'Consultation', 'System', 'Reminder'], // Categorize notification types
      default: 'System',
    },
    read: {
      type: Boolean,
      default: false, // Indicates if the notification has been read
    },
    createdAt: {
      type: Date,
      default: Date.now, // Auto-set creation timestamp
    },
  },
  {
    timestamps: true, // Automatically handle `createdAt` and `updatedAt` fields
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;