const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    if (!id) {
      throw new Error("ID is required for token generation");
    }

    console.log("Generating token for ID:", id);
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    console.log("Token generated successfully");
    return token;
  } catch (error) {
    console.error("Token generation failed:", error.message);
    throw error;
  }
};

module.exports = { generateToken };
