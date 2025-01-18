const Appointment = require('../../models/appointmentModel');

// @desc    Get consultation details by appointment ID
// @route   GET /api/consultations/:id
// @access  Private (Doctor or Patient)

const getConsultationDetails = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id)
        .populate('patientId', 'name email')
        .populate('doctorId', 'name email specailization');

    if(appointment) {
        if(
            appointment.patientId._id.toString() === req.user._id.toString() ||
            appointment.doctorId._id.toString() === req.user._id.toString()
        ) {
            res.json(appointment);
        }
        else {
            res.status(401);
            throw new Error('You are not authorized to view this consultation');
        }
    } else {
        res.status(404);
        throw new Error('Consultation not found');
    }
}

// @desc Uload a prescription for a completed consultation
// @route PUT /api/consultations/:id/prescription
// @access Private (Doctor only)

const uploadPrescription = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if(appointment && appointment.doctorId.toString() === req.user._id.toString()) {
        appointment.prescriptions = req.body.prescriptions || appointment.prescriptions;
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } else {
        res.status(404);
        throw new Error('Appointment not found or you are not authorized to upload prescription');
    }
}

// @desc   Mark appointment as completed
// @route  PUT /api/consultations/:id/complete
// @access Private (Doctor only)

const completeConsultation = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if(appointment && appointment.doctorId.toString() === req.user._id.toString()) {
        appointment.status = 'completed';
        const completedAppointment = await appointment.save();
        res.json(completedAppointment);
    } else {
        res.status(404);
        throw new Error('Appointment not found or you are not authorized to complete consultation');
    }
}


//@desc   Get patient's consultation history
//@route  GET /api/consultations/patient/history
//@access Private (Patient only)

const getPatientConsultationHistory = async (req, res) => {
    const consultations = await Appointment.find({patientId: req.user._id, status: 'completed'})
        .populate('doctorId', 'name specialization')
        .sort({date: -1});

    if(consultations) {
        res.json(consultations);
    } else {
        res.status(404);
        throw new Error('No consultations found');
    }

}

//@desc   Get doctor's consultation history
//@route  GET /api/consultations/doctor/history
//@access Private (Doctor only)

const getDoctorConsultationHistory = async (req, res) => {
    const consultations = await Appointment.find({doctorId: req.user._id, status: 'completed'})
        .populate('patientId', 'name email')
        .sort({date: -1});

    if(consultations) {
        res.json(consultations);
    } else {
        res.status(404);
        throw new Error('No consultations found');
    }
}

// @desc Download prescription for a specific appointment
// @route GET /api/appointments/:id/prescription
// @access Private (Patient or Doctor)

const downloadPrescription = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if(appointment) {
        if(appointment.patientId.toString() === req.user._id.toString() || appointment.doctorId.toString() === req.user._id.toString()) {
            if(appointment.prescriptions) {
                // send the prescripion file as a response
                res.download(appointment.prescriptions, 'prescription.pdf');
                res.json(appointment.prescriptions);
            } else {
                res.status(404);
                throw new Error('Prescription not found');
            }
        } else {
            res.status(401);
            throw new Error('You are not authorized to download prescription');
        }
    } else {
        res.status(404);
        throw new Error('Appointment not found');
    }
}


module.exports = {getConsultationDetails, uploadPrescription, completeConsultation, getPatientConsultationHistory, getDoctorConsultationHistory, downloadPrescription};