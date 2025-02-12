const mongoose = require('mongoose');

const idGeneratorSchema = new mongoose.Schema({
    doctorIdCounter: {
        type: Number,
        default: 1 // Starting value for doctor IDs
    },
    patientIdCounter: {
        type: Number,
        default: 1 // Starting value for patient IDs
    },
    adminIdCounter: {
        type: Number,
        default: 1 // Starting value for admin IDs
    }
});

// Static method to get and increment counter
idGeneratorSchema.statics.getNextId = async function(counterType) {
    const doc = await this.findOneAndUpdate(
        {},
        { $inc: { [counterType]: 1 } },
        { new: true, upsert: true }
    );
    return doc[counterType];
};

const IdGenerator = mongoose.model('IdGenerator', idGeneratorSchema);

module.exports = IdGenerator;