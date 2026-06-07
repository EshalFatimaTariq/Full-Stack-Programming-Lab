const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');

// --- MOCK NOTIFICATION SYSTEM TRIGGER ---
const sendNotification = (userEmail, subject, message) => {
    console.log(`\n==================================================`);
    console.log(`📧 [MOCK EMAIL ALERT SENT TO: ${userEmail}]`);
    console.log(`📝 SUBJECT: ${subject}`);
    console.log(`💬 MESSAGE: ${message}`);
    console.log(`==================================================\n`);
};

// @route   GET /api/admin/dashboard
// @desc    Get overall system stats for Admin
// @access  Private (Admin only)
router.get('/dashboard', protect, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }

        const totalUsers = await User.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });

        res.status(200).json({
            success: true,
            stats: { totalUsers, totalAppointments, pendingAppointments }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/admin/appointments/:id
// @desc    Approve/Reject appointments and trigger dynamic notifications
// @access  Private (Admin or Doctor)
router.put('/appointments/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'Admin' && req.user.role !== 'Doctor') {
            return res.status(403).json({ success: false, message: 'Unauthorized action.' });
        }

        const { status } = req.body; // Expecting 'Confirmed', 'Cancelled', or 'Completed'
        
        let appointment = await Appointment.findById(req.params.id).populate('patient', ['email', 'name']);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        appointment.status = status;
        await appointment.save();

        // Trigger dynamic notification compliance alert
        sendNotification(
            appointment.patient.email,
            `Your Appointment Status Update: ${status}`,
            `Hello ${appointment.patient.name}, your appointment scheduled for ${appointment.appointmentDate.toDateString()} at ${appointment.timeSlot} has been marked as: ${status}.`
        );

        res.status(200).json({ success: true, message: `Appointment ${status} successfully.`, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user account and wipe their systemic footprint
// @access  Private (Admin only)
router.delete('/users/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'User deleted from healthcare records successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;