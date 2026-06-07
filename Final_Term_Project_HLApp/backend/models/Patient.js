const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    // We link the patient record directly to a User account ID
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please add a date of birth']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Please specify gender']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please add a contact number'],
        trim: true
    },
    medicalHistory: {
        type: [String], // Array of strings to store conditions like ['Hypertension', 'Diabetes']
        default: []
    },
    emergencyContact: {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phone: { type: String, required: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Patient', PatientSchema);