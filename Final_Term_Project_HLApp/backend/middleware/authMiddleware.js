const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware verifies the JWT token sent in the request headers
const protect = async (req, res, next) => {
    let token;

    // Check if the token exists in the Authorization header and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Split the "Bearer <TOKEN>" string to extract just the token part
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user belonging to this token from the DB and attach it to the request object
            req.user = await User.findById(decoded.id);

            // Move on to the actual API route logic
            return next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    // If no token was sent at all
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };