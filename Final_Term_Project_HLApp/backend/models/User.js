const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // Prevents duplicate email registrations
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // When fetching users, don't return the password by default for security
    },
    role: {
        type: String,
        enum: ['Admin', 'Doctor', 'Patient'],
        required: [true, 'Please specify a role']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- PASSWORD HASHING MIDDLEWARE (bcrypt) ---
// This runs automatically BEFORE a user is saved to the database
UserSchema.pre('save', async function(next) {
    // Only hash the password if it's being modified or created new
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// --- PASSWORD COMPARISON METHOD ---
// Helper function to check if an entered password matches the hashed one in the database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);