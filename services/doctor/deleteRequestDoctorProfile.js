const Doctor = require("../../models/doctorModel");
const DeleteRequest = require("../../models/accountDeletionModel");

const deleteDoctorProfile = async (doctor, reason) => {
  try {
    const doctorProfile = await Doctor.findById(doctor._id);
    if (!doctorProfile) {
      throw new Error("Doctor not found");
    }

    const deleteRequest = new DeleteRequest({
      userId: doctor._id,
      userTypeId: doctor.doctor_id,
      userModel: "Doctor",
      reason,
    });

    await deleteRequest.save();

    return deleteRequest;
  } catch (error) {
    console.error("Error during doctor profile deletion:", error.message);
    throw new Error("Failed to delete doctor profile.");
  }
};

module.exports = deleteDoctorProfile;
