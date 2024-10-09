const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recordType: {
        type: String,
        // enum: ['prescription', 'report'],
        required: true
    },
    recordDate: {
        type: Date,
        required: true
    },
    fileURL: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;