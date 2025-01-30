const ConsultationRecord = require("../models/consultationRecordModel");
const Patient = require("../models/patientModel");
const Notification = require("../models/notificationModel");
const Prescription = require("../models/prescription");
// const cloudinary = require('cloudinary').v2;

// Helper function for error handling
const handleError = (res, error) => {
  res.status(500).json({ message: error.message });
};

// Helper function for not found responses
const handleNotFound = (res, message) => {
  res.status(404).json({ message });
};

// View consultation history for a patient
const viewConsultationHistory = async (req, res) => {
  const { _id } = req.patient;
  try {
    // const { patientId } = req.params;
    const consultations = await ConsultationRecord.find({ patient_id: _id });

    if (!consultations.length) {
      return res.status(200).json({ message: "No consultations found" });
    }
    res.status(200).json(consultations);
  } catch (error) {
    handleError(res, error);
  }
};

// Get details of a specific consultation
const getConsultationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await ConsultationRecord.findById(id);
    if (!consultation) {
      return handleNotFound(res, "Consultation not found");
    }
    const prescription = await Prescription.findOne({ consultation_id: id });
    if (prescription) {
      return res.status(200).json({ consultation, prescription });
    }
    res.status(200).json(consultation);
  } catch (error) {
    handleError(res, error);
  }
};

// Upload medical reports for a consultation
const uploadMedicalReports = async (req, res) => {
  const patient = req.patient;
  if (!patient) {
    return res.status(401).json({ message: "Patient not found" });
  }

  try {
    const { id } = req.params;
    const consultation = await ConsultationRecord.findById(id);
    if (!consultation) {
      return handleNotFound(res, "Consultation not found");
    }
    const files = req.files;
    if (!files) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Handle file uploads
    const newMedicalReports = files.medical_reports.map((file) => ({
      type: file.mimetype,
      url: file.path,
    }));
    consultation.medical_reports = [
      ...consultation.medical_reports,
      ...newMedicalReports,
    ];
    await consultation.save();
    res.status(200).json(consultation);
  } catch (error) {
    handleError(res, error);
  }
};

// Download prescription for a consultation
const downloadPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await ConsultationRecord.findById(id);

    if (!consultation || !consultation.prescription) {
      return handleNotFound(res, "Prescription not found");
    }
    const prescription = consultation.prescription;
    return res
      .status(200)
      .json({ message: "Prescription downloaded", prescription });
  } catch (error) {
    handleError(res, error);
  }
};

// Get notifications for a patient
const getNotifications = async (req, res) => {
  try {
    const { patient_id } = req.patient;
    const notifications = await Notification.find({
      recipient: patient_id,
      recipientType: "Patient",
    });
    if (!notifications.length) {
      return handleNotFound(res, "No notifications found");
    }
    res.status(200).json(notifications);
  } catch (error) {
    handleError(res, error);
  }
};

// Get Room for joining the consultation
const getRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const consultation = await ConsultationRecord.findById(id);
    if (!consultation) {
      return handleNotFound(res, "Consultation not found");
    }
    res.status(200).json({
      room_name: consultation.room_name,
      isActive: consultation.isActive,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Export functions
module.exports = {
  viewConsultationHistory,
  getConsultationDetails,
  uploadMedicalReports,
  downloadPrescription,
  getNotifications,
  getRoom,
};
