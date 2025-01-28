const mongoose = require("mongoose");

// Enable mongoose debugging
// mongoose.set('debug', true);

const doctorSchema = new mongoose.Schema({
  doctor_id: {
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
  profile_picture_url: { type: String },
  bio: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
  },
  specialization: { type: String, required: true },
  qualifications: [String],
  experience_years: { type: Number, required: true },
  license_number: { type: String, required: true, unique: true },
  consultation_fee: { type: Number, required: true },
  availability: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      day: String,
      time_slots: [String],
    },
  ],
  languages_spoken: [String],
  hospital_affiliations: [
    {
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        postal_code: String,
        country: String,
      },
    },
  ],
  awards_and_recognitions: [String],
  role: { type: String, default: "doctor" },
  status: { type: String, default: "active" },
  ratings: {
    average_rating: { type: Number, default: 0 },
    total_reviews: { type: Number, default: 0 },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  verification_status: { type: Boolean, default: false },
  documents: [
    {
      type: { type: String, required: true }, // e.g., 'application/pdf'
      url: { type: String, required: true }, // e.g., Cloudinary file URL
    },
  ],
  notifications_enabled: { type: Boolean, default: true },
  identity_verified: { type: Boolean, default: false },
  two_factor_enabled: { type: Boolean, default: false },
  audit_logs: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  consent_form_signed: { type: Boolean, default: false },
  terms_accepted: { type: Boolean, default: false },
  video_call_link: { String },
  chat_enabled: { type: Boolean, default: true },
  calendar_sync_enabled: { Boolean },
  social_links: {
    linkedin: String,
    twitter: String,
  },
  approval: {
    status: {
      type: String,
      // required: true,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reason: {
      type: String,
      // required: function() { return this.approval.status === 'Rejected'; }
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

// doctorSchema.post('save', function(doc) {
//     console.log('Doctor has been saved:', doc);
// });

// doctorSchema.post('update', function(doc) {
//     console.log('Doctor has been updated:', doc);
// });

// doctorSchema.post('remove', function(doc) {
//     console.log('Doctor has been removed:', doc);
// });

// doctorSchema.post('find', function(result) {
//     console.log('Doctor find query executed:', result);
// });

// doctorSchema.post('findOne', function(result) {
//     console.log('Doctor findOne query executed:', result);
// });

// doctorSchema.post('findOneAndUpdate', function(result) {
//     console.log('Doctor findOneAndUpdate query executed:', result);
// });

// doctorSchema.post('findOneAndRemove', function(result) {
//     console.log('Doctor findOneAndRemove query executed:', result);
// });

// doctorSchema.post('findById', function(result) {
//     console.log('Doctor findById query executed:', result);
// });

// password hashing before saving to database
//  doctorSchema.pre("save", async function (next) {
//       if (!this.isModified("password")) {
//           next();
//       }

//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//       next();
//   });

//  password verification
//   doctorSchema.methods.matchPassword = async function (enteredPassword) {
//       return await bcrypt.compare(enteredPassword, this.password);
//   };

module.exports = mongoose.model("Doctor", doctorSchema);
