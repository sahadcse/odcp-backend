const ConsultationRecord = require('../../models/consultationRecordModel');

// View all consultations
const viewConsultations = async (req, res) => {
    try {
        const consultations = await ConsultationRecord.find();
        res.status(200).json(consultations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View details of a specific consultation
const viewConsultationDetails = async (req, res) => {
    try {
        const consultation = await ConsultationRecord.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }
        res.status(200).json(consultation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    viewConsultations,
    viewConsultationDetails
};
