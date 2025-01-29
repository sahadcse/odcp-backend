const Doctor = require("../../models/doctorModel");
const { generateDoctorId } = require("../../utils/idGenerator");
const { generateToken } = require("../../utils/tokenGenerator");

const registerDoctorService = async (inputData) => {
  const { email } = inputData;

  // Check if doctor already exists
  if (await Doctor.findOne({ email })) {
    throw new Error("Doctor already exists");
  }

  const validateInputFields = (inputData) => {
    const schemaPaths = Object.keys(Doctor.schema.paths);
    const missingFields = schemaPaths.filter(
      (field) => !Object.keys(inputData).includes(field) && Doctor.schema.paths[field].isRequired
    );

    console.log("Missing fields:", missingFields);
    return missingFields;
  };

  try {
    // Generate doctor_id
    const doctor_id = generateDoctorId();

    // Validate input fields
    const missingFields = validateInputFields({ ...inputData, doctor_id });
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Create and save new doctor
    const doctor = new Doctor({ ...inputData, doctor_id });

    await doctor.save();

    // Return sanitized doctor data
    return {token, doctor};
  } catch (error) {
    console.error("Error during doctor save:", error.message);
    throw new Error("Failed to save doctor data.");
  }
};

module.exports = registerDoctorService;
