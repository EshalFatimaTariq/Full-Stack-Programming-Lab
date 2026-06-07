const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/patients/profile
// @desc    Create or update current patient's clinical profile
// @access  Private (Requires JWT token)
router.post('/profile', protect, async (req, res) => {
    try {
        // Enforce that only users registered with the 'Patient' role can do this
        if (req.user.role !== 'Patient') {
            return res.status(403).json({ success: false, message: 'Access denied. Patients only.' });
        }

        const { dateOfBirth, gender, phoneNumber, medicalHistory, emergencyContact } = req.body;

        // Build the profile object dynamically
        const profileFields = {
            user: req.user.id, // Pulled straight from the logged-in user's token
            dateOfBirth,
            gender,
            phoneNumber,
            medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : medicalHistory.split(',').map(item => item.trim()),
            emergencyContact
        };

        // Check if a profile already exists for this patient
        let patientProfile = await Patient.findOne({ user: req.user.id });

        if (patientProfile) {
            // Update existing profile
            patientProfile = await Patient.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.status(200).json({ success: true, message: 'Profile updated successfully', data: patientProfile });
        }

        // Create a completely new profile if one doesn't exist
        patientProfile = new Patient(profileFields);
        await patientProfile.save();
        
        res.status(201).json({ success: true, message: 'Profile created successfully', data: patientProfile });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/patients/profile
// @desc    Get current logged-in patient's clinical profile
// @access  Private (Requires JWT token)
router.get('/profile', protect, async (req, res) => {
    try {
        // Find profile and populate the parent user info (name, email) into the response
        const profile = await Patient.findOne({ user: req.user.id }).populate('user', ['name', 'email']);
        
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Patient profile not found. Please create one.' });
        }

        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;