const Doctor = require("../../models/doctorModel");

const updateDoctorProfile = async (doctorId, updatedData) => {
  const doctor = await Doctor.findById(doctorId);

  if (doctor) {
    const fieldsToUpdate = [
      "full_name", "email", "phone_number", "bio", "address", "specialization",
      "qualifications", "experience_years", "consultation_fee", "availability",
      "languages_spoken", "hospital_affiliations", "awards_and_recognitions", "social_links"
    ];

    // Update doctor fields with updated data if available
    fieldsToUpdate.forEach(field => {
      if (updatedData[field]) {
        doctor[field] = updatedData[field];
      }
    });

    // Handle file uploads
    if (updatedData.files && updatedData.files.profile_picture_url) {
      doctor.profile_picture_url = updatedData.files.profile_picture_url[0].path;
    }
    if (updatedData.files && updatedData.files.documents) {
      doctor.documents = updatedData.files.documents.map(file => ({ type: file.mimetype, url: file.path }));
    }

    const updatedDoctor = await doctor.save();

    // Collect updated fields to return in response
    const updatedFields = fieldsToUpdate.reduce((acc, field) => {
      if (doctor[field]) {
        acc[field] = doctor[field];
      }
      return acc;
    }, {});

    return {
      _id: updatedDoctor._id,
      ...updatedFields,
      profile_picture_url: updatedDoctor.profile_picture_url,
      documents: updatedDoctor.documents,
      updated_at: updatedDoctor.updated_at,
    };
  } else {
    throw new Error("Doctor not found");
  }
};

module.exports = updateDoctorProfile;
