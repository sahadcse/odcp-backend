const ConsultationRecord = require("../models/consultationRecordModel");
const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");

// View consultation history
const viewConsultationHistory = async (req, res) => {
  const { _id } = req.doctor;

  try {
    const consultations = await ConsultationRecord.find({ doctor_id: _id });
    if (!consultations.length) {
      return res.status(404).json({ message: "No consultations found" });
    }
    res.status(200).json(consultations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching consultation history", error });
  }
};

// Get details of a specific consultation
const getConsultationDetails = async (req, res) => {
  // console.log(req.params.id);
  try {
    const consultation = await ConsultationRecord.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    res.status(200).json(consultation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching consultation details", error });
  }
};

// Start a consultation
const startConsultation = async (req, res) => {
  try {
    const consultation = await ConsultationRecord.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    consultation.status = "Ongoing";
    consultation.start_time = new Date().toISOString();
    await consultation.save();
    res.status(200).json({ message: "Consultation started", consultation });
  } catch (error) {
    res.status(500).json({ message: "Error starting consultation", error });
  }
};

// Mark consultation as completed
const completeConsultation = async (req, res) => {
  try {
    const consultation = await ConsultationRecord.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    consultation.status = "Completed";
    consultation.end_time = new Date().toISOString();
    consultation.notes = req.body.notes;
    await consultation.save();
    res.status(200).json({ message: "Consultation completed", consultation });
  } catch (error) {
    res.status(500).json({ message: "Error completing consultation", error });
  }
};

// Upload a prescription
const uploadPrescription = async (req, res) => {
  try {
    const consultation = await ConsultationRecord.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    consultation.prescription = req.body.prescription;
    await consultation.save();
    res.status(200).json({ message: "Prescription uploaded", consultation });
  } catch (error) {
    res.status(500).json({ message: "Error uploading prescription", error });
  }
};

// Cancel a consultation
const cancelConsultation = async (req, res) => {
  try {
    const consultation = await ConsultationRecord.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    consultation.status = "Cancelled";
    await consultation.save();
    res.status(200).json({ message: "Consultation cancelled", consultation });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling consultation", error });
  }
};

// Get the number of patients a doctor has based on consultations
const totalPatients = async (req, res) => {
  const { _id } = req.doctor;

  try {
    const consultations = await ConsultationRecord.find({
      doctor_id: _id,
    }).distinct("patient_id");
    if (!consultations.length) {
      return res.status(404).json({ message: "No consultations found" });
    }
    const patients = await Patient.find({ _id: { $in: consultations } });
    if (!patients.length) {
      return res.status(404).json({ message: "No patients found" });
    }
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
};

const createRoom = async (req, res) => {
  const { doctor_id, patient_id, scheduledAt, start_time } = req.body;

  if (!doctor_id || !patient_id || !scheduledAt || !start_time) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const room_name = `consultation_${doctor_id}_${patient_id}_${scheduledAt}`;

  try {
    const consultation = await ConsultationRecord.create({
      doctor_id,
      patient_id,
      scheduledAt,
      start_time,
      room_name,
      status: "Waiting",
    });
    await consultation.save();
    res.status(201).json({ message: "Room created", consultation });
  } catch (error) {
    res.status(500).json({ message: "Error creating room", error });
  }
};

module.exports = {
  viewConsultationHistory,
  getConsultationDetails,
  startConsultation,
  completeConsultation,
  uploadPrescription,
  cancelConsultation,
  totalPatients,
  createRoom,
};
