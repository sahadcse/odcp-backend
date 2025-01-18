const mongoose = require('mongoose');
const Patient = require('../../models/patientModel');
const accountDeletion = require('../../models/accountDeletionModel');

// List all patients
const allPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        if (!patients) {
            return res.status(404).json({ message: 'No patients found' });
        }
        res.status(200).json(patients);
    } catch (error) {
        console.log('Error in listPatients:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get patient details
const getPatientDetails = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid patient ID' });
        }
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Block a patient
const blockPatient = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid patient ID' });
        }
        const patient = await Patient.findByIdAndUpdate(req.params.id, { status: 'blocked' }, { new: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient blocked successfully', patient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unblock a patient
const unblockPatient = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid patient ID' });
        }
        const patient = await Patient.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient unblocked successfully', patient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve patient account deletion
const approvePatientDeletion = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid patient ID' });
        }
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // change the account deletion request status to approved
        const deletionRequest = await accountDeletion.findOneAndUpdate(
            { userId: req.params.id, userModel: 'Patient' },
            { status: 'approved' },
            { new: true }
        );
        
        res.status(200).json({ message: 'Patient account deleted successfully', deletionRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    allPatients,
    getPatientDetails,
    blockPatient,
    unblockPatient,
    approvePatientDeletion
};
