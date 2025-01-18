const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'user_type'
    },
    user_type: {
        type: String,
        enum: ['Doctor', 'Patient'],
        required: true
    },
    action_type: {
        type: String,
        enum: [
            'Registration',       // User registration
            'Appointment Booking', // Appointment creation by patient
            'Appointment Update', // Update of appointment details by admin/doctor
            'Appointment Cancel', // Appointment cancellation
            'Consultation Start', // When consultation starts
            'Consultation End',   // When consultation ends
            'Prescription Issued', // Prescription issued by doctor
            'Account Deletion Request', // Request for account deletion
            'Account Deletion Approved', // Admin approves deletion
            'Document Upload',    // Files/documents uploaded
            'Payment',            // Payment events
            'Profile Update'      // Profile edits
        ],
        required: true
    },
    reference_id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'action_reference',
        required: true
    },
    action_reference: {
        type: String,
        enum: ['Appointment', 'Consultation', 'Payment', 'Document'],
        required: true
    },
    description: {
        type: String, // Optional description of the action/event
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: Object, // Additional optional data related to the record
        default: {}
    }
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
