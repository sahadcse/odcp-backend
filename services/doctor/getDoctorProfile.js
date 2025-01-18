const Doctor = require("../../models/doctorModel");

const getDoctorProfileService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    return { message: "Doctor not found" };
  }

  if (doctor) {
    const fieldsToReturn = [ "_id", "full_name", "email", "password", "phone_number", "date_of_birth", "gender", "profile_picture_url", "bio", "address", "specialization", "qualifications", "experience_years", "license_number", "consultation_fee", "availability", "languages_spoken", "hospital_affiliations", "awards_and_recognitions", "role", "status", "ratings", "created_at", "updated_at", "verification_status", "documents", "notifications_enabled", "identity_verified", "two_factor_enabled", "audit_logs", "consent_form_signed", "terms_accepted", "video_call_link", "chat_enabled", "calendar_sync_enabled", "social_links",
    ];

    const doctorProfile = fieldsToReturn.reduce((acc, field) => {
      acc[field] = doctor[field];
      return acc;
    }, {});

    return doctorProfile;
  } else {
    throw new Error("Doctor not found");
  }
};

module.exports = getDoctorProfileService;
