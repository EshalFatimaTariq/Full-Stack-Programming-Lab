const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from your .env file
dotenv.config();

// Connect to the local MongoDB database
connectDB();

// Initialize the Express framework
const app = express();

// Middleware to handle security and data formatting
app.use(cors()); // Allows your Next.js frontend to talk to this backend safely
app.use(express.json()); // Allows your backend to read JSON data sent in requests
// Mount your routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/records', require('./routes/medicalRecords'));
app.use('/api/admin', require('./routes/admin'));

// A simple test route to check if the server is alive
app.get('/', (req, res) => {
    res.send('Healthcare App Backend API is running successfully!');
});

// Set the server port and start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in development mode on port ${PORT}`);
});