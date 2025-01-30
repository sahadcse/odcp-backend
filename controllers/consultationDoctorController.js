const ConsultationRecord = require("../models/consultationRecordModel");
const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");
const Prescription = require("../models/prescription");
const Appointment = require("../models/appointmentModel");

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
    const prescription = await Prescription.findById(consultation.prescription_id);
    if (prescription) {
      return res.status(200).json({ consultation, prescription });
    }
    return res.status(200).json({ consultation });
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
  const {id} = req.params;
  if(!id, !req.body) {
    return res.status(400).json({ message: "Consultation ID and prescription details are required" });
  }

  try {
    const consultation = await ConsultationRecord.findById(id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    const patient = await Patient.findById(consultation.patient_id);
    const doctor = await Doctor.findById(consultation.doctor_id);

    if (!patient || !doctor) {
      return res.status(404).json({ message: "Patient or doctor not found" });
    }

    req.body.patient = {
      ...req.body.patient,
      name: patient.full_name,
      age: new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear(),
      gender: patient.gender
    };

    req.body.doctor = {
      name: doctor.full_name,
      registrationNo: doctor.license_number
    };

    const prescription = new Prescription({
      consultation_id: id,
      patient: req.body.patient,
      symptoms: req.body.symptoms,
      vitals: req.body.vitals,
      diagnosis: req.body.diagnosis,
      allergies: req.body.allergies,
      prescription: req.body.prescription,
      lifestyleRecommendations: req.body.lifestyleRecommendations,
      recommendedTests: req.body.recommendedTests,
      followUp: req.body.followUp,
      doctor: req.body.doctor,
      date: new Date()
    });

    await prescription.save();
    consultation.prescription_id = prescription._id;
    await consultation.save();

    res.status(201).json({ message: "Prescription uploaded successfully", prescription });
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

const getRoomName = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Consultation ID is required" });
  }
  try {
    const consultation = await ConsultationRecord.findById(id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    res.status(200).json({ room_name: consultation.room_name });
  } catch (error) {
    res.status(500).json({ message: "Error fetching room name", error });
  }
};

const getPatientDetailsForLive = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Consultation ID is required" });
  }
  try {
    const consultation = await ConsultationRecord.findById(id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    const patient = await Patient.findById(consultation.patient_id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient details", error });
  }
}

const getPatientFiles = async (req, res) => {
  const { patient_id } = req.params;
  if (!patient_id) {
    return res.status(400).json({ message: "Patient ID is required" });
  }
  try {
    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const consultations = await ConsultationRecord.find({ patient_id });
    const appointments = await Appointment.find({ patient_id });

    const response = {
      patientFiles: patient.medical_reports?.map(report => ({ type: report.type, url: report.url })) || [],
      consultationFiles: consultations.flatMap(consultation => 
      consultation.medical_reports?.map(report => ({ type: report.type, url: report.url })) || []
      ),
      appointmentFiles: appointments.flatMap(appointment => 
      appointment.files?.map(file => ({ type: file.type, url: file.url })) || []
      )
    };

    res.status(200).json(response);
    } catch (error) {
    res.status(500).json({ message: "Error fetching patient files", error });
    }
}

module.exports = {
  viewConsultationHistory,
  getConsultationDetails,
  startConsultation,
  completeConsultation,
  uploadPrescription,
  cancelConsultation,
  totalPatients,
  getRoomName,
  getPatientDetailsForLive,
  getPatientFiles
};
