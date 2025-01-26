const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const Doctor = require("../models/doctorModel");
const ConsultationRecord = require("../models/consultationRecordModel");
const Patient = require("../models/patientModel");

// View all appointments for the doctor
const viewAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor_id: req.doctor._id,
    }).populate("patient_id");
    const patientDetails = appointments.map((appointment) => {
      return {
        appointment,
        // patient: appointment.patient_id
      };
    });
    res.status(200).json(patientDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get details of a specific appointment
const getAppointmentDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "patient_id"
    );
    if (!appointment) {
      return res.status(404).json({
        message: `Appointment not found for ${req.doctor.full_name} with ID: ${req.params.id}`,
      });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm an appointment
const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Confirmed" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Create a consultation record
    const consultation = new ConsultationRecord({
      appointment_id: appointment._id,
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      consultation_date: appointment.appointment_date,
      room_name: `room_${Date.now()}`,
      scheduledAt: appointment.appointment_date,
      isActive: false, // Default false
      start_time: appointment.time_slot,
      issues: appointment.reason_for_visit,
      consultation_fee: appointment.booking_fee,
    });
    await consultation.save();

    res.status(200).json({
      success: true,
      message: `Appointment confirmed for ${req.doctor.full_name} with ID: ${req.params.id}`,
      appointment,
      consultation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    // colsultation record status update to cancelled
    await ConsultationRecord.findOneAndUpdate(
      { appointment_id: req.params.id },
      { status: "Cancelled" }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Issue a notification for the patient
    const notification = new Notification({
      recipient: appointment.patient_id,
      recipientType: "Patient",
      title: "Appointment Cancelled",
      message: `Your appointment with ${
        req.doctor.full_name
      } on ${appointment.appointment_date.toDateString()} has been cancelled.`,
      type: "Appointment",
      read: false,
    });
    await notification.save();

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notifications for the doctor
const getNotifications = async (req, res) => {
  const { doctor_id } = req.doctor;
  try {
    const notifications = await Notification.find({
      recipient: doctor_id,
      recipientType: "Doctor",
    });
    if (!notifications.length) {
      return res
        .status(404)
        .json({ message: `No notifications found- ${req.doctor.full_name}.` });
    }
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set availability
const setAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Add new availability data without removing old data
    doctor.availability = [...doctor.availability, ...req.body.availability];
    await doctor.save();

    res.status(200).json(doctor.availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get availability details
const getAvailabilityDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor.availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update availability
const modifyAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const availabilityIndex = doctor.availability.findIndex(
      (slot) => slot._id.toString() === req.params.id
    );

    if (availabilityIndex === -1) {
      return res.status(404).json({ message: "Availability not found" });
    }

    // Update the specific availability slot
    doctor.availability[availabilityIndex] = {
      ...doctor.availability[availabilityIndex],
      ...req.body,
    };
    await doctor.save();

    res.status(200).json(doctor.availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete specific availability
const deleteAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const availabilityIndex = doctor.availability.findIndex(
      (slot) => slot._id.toString() === req.params.availabilityId
    );

    if (availabilityIndex === -1) {
      return res.status(404).json({ message: "Availability not found" });
    }

    doctor.availability.splice(availabilityIndex, 1);
    await doctor.save();

    res.status(200).json({ message: "Availability deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get patient details for a specific appointment
const getPatientDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "patient_id"
    );
    if (!appointment) {
      return res.status(404).json({
        message: `Appointment not found for ${req.doctor.full_name} with ID: ${req.params.id}`,
      });
    }
    const patient = await Patient.findById(appointment.patient_id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  viewAppointments,
  getAppointmentDetails,
  confirmAppointment,
  cancelAppointment,
  getNotifications,
  setAvailability,
  getAvailabilityDetails,
  modifyAvailability,
  deleteAvailability,
  getPatientDetails,
};
