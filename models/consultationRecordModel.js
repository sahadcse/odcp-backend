const mongoose = require("mongoose");

const consultationRecordSchema = new mongoose.Schema({
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
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
  consultation_date: {
    type: Date,
    required: true,
  },
  room_name: {
    type: String,
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: false, // Make scheduledAt optional
  },
  start_time: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false, // Initially false
  },
  end_time: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Waiting", "Ongoing", "Completed", "Cancelled"],
    default: "Waiting",
    required: true,
  },
  issues: {
    type: String,
    required: true,
  },
  // prescription: {
  //   type: new mongoose.Schema({
  //     medications: [
  //       {
  //         name: { type: String, required: true },
  //         dosage: { type: String, required: true }, // e.g., '500mg'
  //         frequency: { type: String, required: true }, // e.g., 'Twice a day'
  //         duration: { type: String, required: true }, // e.g., '7 days'
  //       },
  //     ],
  //     advice: { type: String }, // Additional doctor advice
  //     created_at: { type: Date, default: Date.now },
  //   }),
  //   required: false,
  // },

  prescription_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
    // required: true,
  },
  diagnosis: { type: String }, // Diagnosis made by the doctor
  notes: {
    type: String, // Doctor's notes about the consultation.
  },
  medical_reports: [
    {
      type: new mongoose.Schema({
        type: { type: String, required: true }, // e.g., 'image/png', 'application/pdf'
        url: { type: String, required: true }, // URL to uploaded file
      }),
    },
  ],
  consultation_fee: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["Pending", "Paid", "Refunded"],
    default: "Paid",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

module.exports = mongoose.model("ConsultationRecord", consultationRecordSchema);
