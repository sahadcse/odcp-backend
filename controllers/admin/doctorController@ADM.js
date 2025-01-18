const Doctor = require('../../models/doctorModel');
const deleteAccount = require('../../models/accountDeletionModel');

// List all doctors
const listDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get doctor details
const getDoctorDetails = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve a doctor registration
const approveDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, { 'approval.status': 'Approved' }, { new: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor approved successfully', doctor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject a doctor registration
const rejectDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, { 'approval.status': 'Rejected', 'approval.reason': req.body.reason }, { new: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor rejected successfully', doctor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Block a doctor
const blockDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, { status: 'blocked' }, { new: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor blocked successfully', doctor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unblock a doctor
const unblockDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor unblocked successfully', doctor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve doctor account deletion
const approveDoctorDeletion = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // change the account deletion request status to approved
        const deletionRequest = await deleteAccount.findOneAndUpdate({ userId: req.params.id, userModel: 'Doctor' }, { status: 'approved' }, { new: true });
        
        res.status(200).json({ message: 'Doctor account deleted successfully', deletionRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    listDoctors,
    getDoctorDetails,
    approveDoctor,
    rejectDoctor,
    blockDoctor,
    unblockDoctor,
    approveDoctorDeletion
};
