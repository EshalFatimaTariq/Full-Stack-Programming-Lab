const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    // Links to the patient who booked the appointment
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Links to the doctor being booked
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Please add a date for the appointment']
    },
    timeSlot: {
        type: String,
        required: [true, 'Please add a specific time slot']
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    symptoms: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);