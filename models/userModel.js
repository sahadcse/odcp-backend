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
        require: true
    },
    contactInfo: {
        phone: {
            type: String
        },
        address: {
            type: String
        }
    },
    profilePicture: {
        type: String
    },
    specailization: {
        type: String,
        require: function () {
            return this.role === 'doctor';
        }
    },
    availableSlots: [{
        type: String,
        require: function () {
            return this.role === 'doctor';
        }
    }],
    availability: {
        type: String,
        require: function () {
            return this.role === 'doctor';
        }
    },
    medicalHistory: [{
        condition: {
            type: String
        },
        notes: {
            type: String
        },
    }],
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

const User = mongoose.model('User', userSchema);

module.exports = User;