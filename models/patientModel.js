const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// mongoose.set('debug', true);

const patientSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
    // unique: true
  },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
  date_of_birth: { type: Date, required: true },
  gender: { type: String, required: true },
  profile_picture: { type: String },
  blood_group: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  height: {
    feet: { type: Number, required: true },
    inches: { type: Number, required: true },
  },
  weight: {
    value: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  address: {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
  },
  medical_history: [String],
  medical_reports: [
    {
      type: new mongoose.Schema({
        type: { type: String, required: true }, // e.g., 'image/png', 'application/pdf'
        url: { type: String, required: true }, // URL to uploaded file
      }),
    },
  ],
  current_medications: [String],
  allergies: [String],
  chronic_conditions: [String],
  family_medical_history: [String],
  emergency_contact: {
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone_number: { type: String, required: true },
  },
  role: { type: String, default: "patient" },
  status: { type: String, default: "active" },
  appointments: [
    {
      appointment_id: String,
      doctor_id: String,
      date: Date,
      status: String,
      prescription_url: String,
      notes: String,
    },
  ],
  chat_history: [
    {
      chat_id: String,
      doctor_id: String,
      messages: [
        {
          sender: String,
          message: String,
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  video_call_links: [
    {
      call_id: String,
      link: String,
      status: String,
    },
  ],
  notifications_enabled: { type: Boolean, default: true },
  notifications: [
    {
      type: new mongoose.Schema({
        title: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now },
      }),
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  verification_status: { type: Boolean, default: false },
  terms_accepted: { type: Boolean, default: false },
  identity_verified: { type: Boolean, default: false },
  two_factor_enabled: { type: Boolean, default: false },
  audit_logs: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  consent_form_signed: { type: Boolean, default: false },
  insurance_details: {
    provider_name: String,
    policy_number: String,
    coverage_details: String,
  },
  preferences: {
    language: String,
    notification_preferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
    },
  },
  approval: {
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reason: {
      type: String,
      required: function () {
        return this.approval.status === "Rejected";
      },
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    reviewed_at: {
      type: Date,
    },
  },
});

// password hashing before saving to database
// patientSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// // password verification
// patientSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model("Patient", patientSchema);
