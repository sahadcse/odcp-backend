const Appointment = require('../../models/appointmentModel');
const sendEmail = require('../../utils/sendEmail');
const User = require('../../models/_/userModel');
const io = require('../../server');

// @desc    Request an appointment
// @route   POST /api/appointments
// @access  Private (Patient only)

const requestAppointment = async (req, res) => {
    const { doctorId, date, time, consultationNotes} = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }


    if(!doctorId || !date || !time) {
        res.status(400);
        throw new Error('Doctor ID, date and time are required');
    }

    const appointment = new Appointment({
        patientId: req.user._id,
        doctorId: doctorId,
        date,
        time,
        consultationNotes
    });
    const createdAppointment = await appointment.save();

    // Notify doctor of new appointment request
    io.emit('appointmentNotification',{
        message: `New appointment request from ${req.user.name}`,
        doctorId: doctorId
    }
    );


    // Send email to doctor to confirm appointment
    const doctorEmail = {
        email: doctor.email,
        subject: 'New Appointment Request',
        message: `You have a new appointment request from ${req.user.name} on ${date} at ${time}. ConsultationNotes- ${consultationNotes}. Please login to your account to confirm or reject the request.`
    }
    await sendEmail(doctorEmail);

    // Send email to patient to confirm appointment
    const patientEmail = {
        email: req.user.email,
        subject: 'Appointment Requested',
        message: `You have requsted an appointment with ${doctorId.name} on ${date} at ${time}. ConsultationNotes- ${consultationNotes}. Please wait for the doctor to confirm the appointment.`
    }
    await sendEmail(patientEmail);

    if(createdAppointment) {
        res.status(201).json(createdAppointment);
    }
}

// @desc    Get all appointments for doctor
// @route   GET /api/appointments/doctor
// @access  Private (Doctor only)

const getDoctorAppointments = async (req, res) => {
    const appointments = await Appointment.find({doctorId: req.user._id});

    if(appointments) {
        res.json(appointments);
    }
}

// @desc    Get all appointments for patient
// @route   GET /api/appointments/patient
// @access  Private (Patient only)

const getPatientAppointments = async (req, res) => {
    const appointments = await Appointment.find({patientId: req.user._id});

    if(appointments) {
        res.json(appointments);
    }
}

// @desc    Update appointment status (Doctor confirms/rejects)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor only)

const updateAppointmentStatus = async (req, res) => {
    const {status} = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if(appointment && appointment.doctorId.toString() === req.user._id.toString()) {
        appointment.status = status;
        const updatedAppointment = await appointment.save();

        // Notify patient of appointment status
        io.emit('appointmentNotification',{
            message: `Appointment with Dr. ${appointment.doctor.name} has been ${status}`,
            patientId: appointment.patientId
        });

        // Send email to patient about appointment status
        const patientEmail = {
            email: appointment.patientId.email,
            subject: `Appointment ${status}`,
            message: `Your appointment with ${req.user.name} on ${appointment.date} at ${appointment.time} has been ${status}.`
        }
        await sendEmail(patientEmail)
        
        res.json(updatedAppointment);
    } else {
        res.status(404).json({
            message: 'Appointment not found or you are not authorized to update status'
        })
    }
}





module.exports = {requestAppointment, getDoctorAppointments, getPatientAppointments, updateAppointmentStatus};