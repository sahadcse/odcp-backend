const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  consultation_type: {
    type: String,
    enum: ["Chat", "Audio", "Video"],
    required: true,
  },
  appointment_date: {
    type: Date,
    required: true,
  },
  time_slot: {
    type: String,
    required: true,
  },
  start_time: {
    type: String, // e.g., '14:30'
    // required: true
  },
  end_time: {
    type: String, // e.g., '15:00'
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
    // required: true
  },
  reason_for_visit: {
    type: String,
    required: true,
  },
  booking_fee: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["Pending", "Paid", "Refunded"],
    default: "Pending",
    required: true,
  },
  notes: {
    type: String, // Additional notes added by the patient.
  },
  files: [
    {
      type: new mongoose.Schema({
        type: { type: String, required: true }, // e.g., 'image/png', 'application/pdf'
        url: { type: String, required: true }, // URL to uploaded file
      }),
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
  feedback: {
    type: new mongoose.Schema({
      rating: { type: Number }, // 1-5
      comment: { type: String },
    }),
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
