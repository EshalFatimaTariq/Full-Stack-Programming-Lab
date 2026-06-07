const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI stored in your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected Successfully ✅: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error ❌: ${error.message}`);
        process.exit(1); // Stop the server completely if the database connection fails
    }
};

module.exports = connectDB;