const Patient = require("../../models/patientModel");
const DeleteRequest = require("../../models/accountDeletionModel");

const deleteRequestPatientProfile = async (patient, reason) => {
  try {
    const patientProfile = await Patient.findById(patient._id);
    if (!patientProfile) {
      throw new Error("Patient not found");
    }

    const deleteRequest = new DeleteRequest({
      userId: patient._id,
      userTypeId: patientProfile.patient_id, // Use patientProfile to get patient_id
      userModel: "Patient",
      reason,
    });

    await deleteRequest.save();

    return deleteRequest;
  } catch (error) {
    console.error("Error during patient profile deletion:", error.message);
    throw new Error("Failed to delete patient profile.");
  }
};

module.exports = deleteRequestPatientProfile;
