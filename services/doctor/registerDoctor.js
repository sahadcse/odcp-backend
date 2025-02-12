const Doctor = require("../../models/doctorModel");
const { generateToken } = require("../../utils/tokenGenerator");
const {generateDoctorId}  = require("../../utils/idGenerator");

const registerDoctorService = async (inputData) => {
  const { email } = inputData;

  // Check if doctor already exists
  if (await Doctor.findOne({ email })) {
    throw new Error("Doctor already exists");
  }

  const validateInputFields = (inputData) => {
    const schemaPaths = Object.keys(Doctor.schema.paths);
    const missingFields = schemaPaths.filter(
      (field) =>
        !Object.keys(inputData).includes(field) &&
        Doctor.schema.paths[field].isRequired
    );

    console.log("Missing fields:", missingFields);
    return missingFields;
  };

  try {
    // Generate doctor_id
    const doctor_id = await generateDoctorId();

    // Validate input fields
    const missingFields = validateInputFields({ ...inputData, doctor_id });
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Create and save new doctor
    const doctor = new Doctor({ ...inputData, doctor_id });

    await doctor.save();

    // Generate token
    const token = generateToken(doctor._id);

    console.log("token", token);
    return { token, doctor }; 
    
  } catch (error) {
    console.error("Error during doctor save:", error.message);
    throw new Error("Failed to save doctor data.");
  }
};

module.exports = registerDoctorService;
