require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HLApp_DB')
    .then(() => console.log('📦 Database connected for seeding...'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        // Clear existing data to prevent duplications
        await User.deleteMany();
        await Doctor.deleteMany();
        await Patient.deleteMany();
        console.log('🗑️ Old records cleared.');

        // --- 1. CREATE ADMIN ACCOUNT ---
        // Pass plain text! The User model hook will encrypt it to admin123 automatically
        const adminUser = await User.create({
            name: "Admin Bilal Khan",
            email: "admin@healthcare.pk",
            password: "admin123", 
            role: "Admin"
        });

        // --- 2. DEFINE 15 PAKISTANI DOCTORS ---
        const doctorNames = [
            "Dr. Faisal Shafi", "Dr. Amna Mahmood", "Dr. Zainab Raza", "Dr. Asif Munir", 
            "Dr. Sadia Ikram", "Dr. Khurram Shahzad", "Dr. Maria Bhatti", "Dr. Omer Farooq", 
            "Dr. Nida Yousaf", "Dr. Hammad Naqvi", "Dr. Sana Alvi", "Dr. Rizwan Lodhi", 
            "Dr. Hina Malik", "Dr. Usman Gondal", "Dr. Ayesha Siddiqui"
        ];
        
        const specializations = [
            "Cardiologist", "Pediatrician", "Dermatologist", "General Physician", 
            "Gynecologist", "Orthopedic", "Neurologist", "Psychiatrist", 
            "ENT Specialist", "Urologist", "Ophthalmologist", "General Surgeon",
            "Oncologist", "Pulmonologist", "Endocrinologist"
        ];

        console.log('⏳ Generating 15 Doctor Profiles...');
        for (let i = 0; i < 15; i++) {
            const cleanName = doctorNames[i].replace("Dr. ", "").toLowerCase().replace(/[^a-z]/g, "");
            const email = `${cleanName}@healthcare.pk`;

            const docUser = await User.create({
                name: doctorNames[i],
                email,
                password: "pass123", // Pass plain text -> model handles the hashing!
                role: "Doctor"
            });

            await Doctor.create({
                user: docUser._id,
                specialization: specializations[i],
                experience: 5 + (i % 5),
                consultationFee: 1500 + (i * 100),
                availability: {
                    days: ["Monday", "Wednesday", "Friday"],
                    timeSlots: ["09:00 AM - 12:00 PM", "02:00 PM - 05:00 PM"]
                },
                bio: `Experienced specialist providing top-tier medical care at our clinical facility.`
            });
        }

        // --- 3. DEFINE 15 PATIENTS ---
        const patientNames = [
            "Eshal Fatima Tariq", 
            "Muhammad Ali", "Fatima Bhutto", "Zoya Ahmed", "Ahmed Nawaz", 
            "Amina Jamil", "Hamza Sheikh", "Sara Khan", "Mustafa Qureshi", 
            "Areesha Hassan", "Zain Malik", "Laiba Rehman", "Bilal Siddiqui", 
            "Mariam Nawaz", "Omer Khan"
        ];

        console.log('⏳ Generating 15 Patient Profiles...');
        for (let i = 0; i < 15; i++) {
            const cleanName = patientNames[i].toLowerCase().replace(/[^a-z]/g, "");
            const email = `${cleanName}@healthcare.pk`;
            
            const patUser = await User.create({
                name: patientNames[i],
                email,
                password: "pass123", // Pass plain text -> model handles the hashing!
                role: "Patient"
            });

            await Patient.create({
                user: patUser._id,
                dateOfBirth: new Date(1995 + (i % 5), i, 10 + i),
                gender: i === 0 || i % 2 !== 0 ? "Female" : "Male",
                phoneNumber: `0300${1000000 + i}`,
                medicalHistory: i === 0 ? ["Allergy", "Migraine"] : ["General Checkup"],
                emergencyContact: {
                    name: i === 0 ? "Tariq Mahmood" : "Family Member",
                    relationship: i === 0 ? "Father" : "Guardian",
                    phone: `0321${2000000 + i}`
                }
            });
        }

        console.log('🚀 SUCCESS: 1 Admin, 15 Pakistani Doctors, and 15 Patients injected flawlessly!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();