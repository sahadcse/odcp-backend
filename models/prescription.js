const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    consultation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConsultationRecord",
      required: true,
    }, // Reference to Consultation model
    patient: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
      },
      weight: { type: String, required: true },
    },
    symptoms: [{ type: String, required: true }], // Array of symptoms
    vitals: {
      bp: { type: String }, // Blood Pressure
      temp: { type: String }, // Temperature
      heartRate: { type: Number }, // Heart Rate
    },
    diagnosis: { type: String, required: true },
    allergies: { type: String, default: "None" },
    prescription: [
      {
        medicine: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String },
      },
    ],
    lifestyleRecommendations: [{ type: String }], // Array of lifestyle tips
    recommendedTests: [{ type: String }], // Array of recommended tests
    followUp: { type: String }, // Follow-up instructions
    doctor: {
      name: { type: String, required: true },
      registrationNo: { type: String, required: true },
    },
    // emergencyContact: { type: String, required: true },
    date: { type: Date, required: true },
    // signatureOrStamp: { type: String }, // Path or URL for the signature/stamp if stored digitally
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
