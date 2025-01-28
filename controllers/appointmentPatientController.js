const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");

// Book a new appointment
const bookAppointment = async (req, res) => {
  const { status } = req.body;
  req.body.patient_id = req.patient._id;
  try {
    const { doctor_id, consultation_type, appointment_date, time_slot, reason_for_visit, booking_fee } = req.body;
    if (!doctor_id || !consultation_type || !appointment_date || !time_slot || !reason_for_visit || !booking_fee) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
    // remove status from req.body
    delete req.body.status;

    // Check if filesData is provided and store it
    if (req.files && req.files.filesData) {
      req.body.files = req.files.filesData.map(file => ({
        type: file.mimetype,
        url: file.path,
      }));
    }

    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all doctors for booking an appointment
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View all appointments for a patient
const viewAppointments = async (req, res) => {
  try {
    const patientId = req.patient._id;
    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }
    const appointments = await Appointment.find({ patient_id: patientId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get details of a specific appointment
const getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Cancelled" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reschedule an appointment
const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointment_date, time_slot } = req.body;
    if (!id || !appointment_date || !time_slot) {
      return res
        .status(400)
        .json({ message: "Appointment ID, date, and time_slot are required" });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { appointment_date, time_slot, status: "Pending" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res
      .status(200)
      .json({ message: "Appointment rescheduled successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get Doctor details for a specific appointment
const getDoctorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const doctor = await Doctor.findById(appointment.doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getDoctors,
  viewAppointments,
  getAppointmentDetails,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorDetails,
};
