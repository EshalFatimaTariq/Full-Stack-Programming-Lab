const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    // Links the doctor clinical profile to their core login account
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: [true, 'Please add a medical specialization'],
        trim: true
    },
    experience: {
        type: Number,
        required: [true, 'Please add years of experience']
    },
    consultationFee: {
        type: Number,
        required: [true, 'Please add a consultation fee']
    },
    availability: {
        days: {
            type: [String], // e.g., ['Monday', 'Wednesday', 'Friday']
            required: true
        },
        timeSlots: {
            type: [String], // e.g., ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM']
            required: true
        }
    },
    bio: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Doctor', DoctorSchema);