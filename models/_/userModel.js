const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        required: true
    },
    contactInfo: {
        phone: {
            type: String,
        },
        address: {
            type: String,
        }
    },
    profilePicture: {
        type: String,
    },
    specialization: { 
        type: String,
        required: function () {
            return this.role === 'doctor';
        }
    },
    availableSlots: [{
        type: String,
        required: function () {
            return this.role === 'doctor';
        }
    }],
    availability: {
        type: String,
        required: function () {
            return this.role === 'doctor';
        }
    },
    doctorId: {
        type: String,
        required: function () {
            return this.role === 'doctor';
        }
    },
    authorizedOrganization: {
        type: String,
        required: function () {
            return this.role === 'doctor';
        }
    },
    validPapers: [{
        type: String,
        required: function () {
            return this.role === 'doctor';
        }
    }],
    medicalHistory: [{
        condition: {
            type: String
        },
        notes: {
            type: String
        },
    }],
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
}, {
    timestamps: true
});

// Password hashing before saving to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password verification
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const UserOld = mongoose.model('UserOld', userSchema);

module.exports = UserOld;