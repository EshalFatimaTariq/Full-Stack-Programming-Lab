const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private (Patients only)
router.post('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'Patient') {
            return res.status(403).json({ success: false, message: 'Only patients can book appointments' });
        }

        const { doctor, appointmentDate, timeSlot, symptoms } = req.body;

        const appointment = new Appointment({
            patient: req.user.id, // Pulled from the logged-in patient's token
            doctor,
            appointmentDate,
            timeSlot,
            symptoms
        });

        await appointment.save();
        res.status(201).json({ success: true, message: 'Appointment booked successfully', data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/appointments
// @desc    Get all appointments (Doctor/Patient profiles filter, Admin sees everything)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let appointments;

        // 1. If an Admin is logged in, show ALL system appointments
        if (req.user.role === 'Admin') {
            appointments = await Appointment.find()
                .populate('patient', ['name', 'email'])
                .populate('doctor', ['name', 'email']);
        } 
        // 2. If a Doctor is logged in, show appointments booked with them
        else if (req.user.role === 'Doctor') {
            appointments = await Appointment.find({ doctor: req.user.id })
                .populate('patient', ['name', 'email']);
        } 
        // 3. If a Patient is logged in, show appointments they booked
        else if (req.user.role === 'Patient') {
            appointments = await Appointment.find({ patient: req.user.id })
                .populate('doctor', ['name', 'email']);
        }

        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;