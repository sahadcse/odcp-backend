const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'canceled'],
        default: 'pending'
    },
    consultationNotes: {type: String},
    prescriptions: [
        {
            medicationName: {
                type: String,
                required: true
            },
            dosage: {
                amount: {
                    type: String, // e.g., '500 mg'
                    required: true
                },
                frequency: {
                    type: String, // e.g., '3 times a day'
                    required: true
                },
                duration: {
                    type: String, // e.g., '7 days'
                    required: true
                }
            },
            instructions: {
                type: String, // e.g., 'Take with food.'
                default: ''
            },
            refill: {
                type: Boolean,
                default: false
            },
            prescribedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
}, {
    timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;