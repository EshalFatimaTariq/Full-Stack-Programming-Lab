const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
    // Links to the patient whose health history this belongs to
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Links to the doctor writing the prescription/diagnosis
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    diagnosis: {
        type: String,
        required: [true, 'Please add a medical diagnosis']
    },
    prescription: {
        medication: { type: String, required: true },
        dosage: { type: String, required: true },    // e.g., "Once a day"
        duration: { type: String, required: true }    // e.g., "7 days"
    },
    doctorNotes: {
        type: String,
        trim: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);