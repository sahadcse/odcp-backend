const Appointment = require('../../models/appointmentModel');
const ConsultationRecord = require('../../models/consultationRecordModel');

// Generate system usage reports (appointments, consultations, etc.)
const generateReports = async (req, res) => {
    try {
        const appointmentsCount = await Appointment.countDocuments();
        const consultationsCount = await ConsultationRecord.countDocuments();

        res.status(200).json({
            appointmentsCount,
            consultationsCount,
            // Add more report data as needed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View system-wide analytics
const viewAnalytics = async (req, res) => {
    try {
        const appointments = await Appointment.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const consultations = await ConsultationRecord.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            appointments,
            consultations,
            // Add more analytics data as needed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateReports,
    viewAnalytics
};
