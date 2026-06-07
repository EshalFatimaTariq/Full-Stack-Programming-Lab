const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/records
// @desc    Create a new medical record / prescription
// @access  Private (Doctors only)
router.post('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'Doctor') {
            return res.status(403).json({ success: false, message: 'Access denied. Only doctors can issue medical records.' });
        }

        const { patient, diagnosis, prescription, doctorNotes } = req.body;

        const record = new MedicalRecord({
            patient,
            doctor: req.user.id, // Pulled from the logged-in doctor's token
            diagnosis,
            prescription,
            doctorNotes
        });

        await record.save();
        res.status(201).json({ success: true, message: 'Medical record added successfully', data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/records
// @desc    Get medical records (Doctors see what they wrote, Patients see what they received)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let records;

        if (req.user.role === 'Doctor') {
            records = await MedicalRecord.find({ doctor: req.user.id })
                .populate('patient', ['name', 'email']);
        } else if (req.user.role === 'Patient') {
            records = await MedicalRecord.find({ patient: req.user.id })
                .populate('doctor', ['name', 'email']);
        }

        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;