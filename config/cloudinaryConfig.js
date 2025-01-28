const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Cloudinary Configuration missing
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("Cloudinary configuration is missing");
  process.exit(1);
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_, file) => {
    let resource_type = "image"; // Default to 'image'
    let public_id = file.originalname.replace(/\.\w+$/, ""); // Remove existing extension
    if (file.mimetype === "application/pdf") {
      resource_type = "raw"; // For PDF files
      public_id += ".pdf"; // Explicitly add .pdf
    }

    return {
      folder: "uploads_odcp",
      allowed_formats: resource_type === "image" ? ["jpg", "png", "jpeg"] : [], // Specify formats for images only
      resource_type: resource_type,
      public_id: public_id,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, and PDF files are allowed."
        ),
        false
      );
    }
  },
});

module.exports = { upload, cloudinary };
