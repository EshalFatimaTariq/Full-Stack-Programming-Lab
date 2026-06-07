const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/doctors/profile
// @desc    Create or update current doctor's clinical profile
// @access  Private (Requires JWT token)
router.post('/profile', protect, async (req, res) => {
    try {
        // Enforce that only users registered with the 'Doctor' role can do this
        if (req.user.role !== 'Doctor') {
            return res.status(403).json({ success: false, message: 'Access denied. Doctors only.' });
        }

        const { specialization, experience, consultationFee, availability, bio } = req.body;

        // Build the profile object dynamically
        const profileFields = {
            user: req.user.id, // Pulled from the logged-in doctor's token
            specialization,
            experience,
            consultationFee,
            availability,
            bio
        };

        // Check if a clinical profile already exists for this doctor
        let doctorProfile = await Doctor.findOne({ user: req.user.id });

        if (doctorProfile) {
            // Update existing profile
            doctorProfile = await Doctor.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.status(200).json({ success: true, message: 'Doctor profile updated successfully', data: doctorProfile });
        }

        // Create a completely new clinical profile if one doesn't exist
        doctorProfile = new Doctor(profileFields);
        await doctorProfile.save();
        
        res.status(201).json({ success: true, message: 'Doctor profile created successfully', data: doctorProfile });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/doctors
// @desc    Get all available doctors (Public Directory for patients to search)
// @access  Public (Anyone can browse doctors)
router.get('/', async (req, res) => {
    try {
        // Find all doctors and pull their names and emails from the User collection
        const doctors = await Doctor.find().populate('user', ['name', 'email']);
        res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;