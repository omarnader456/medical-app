const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }   
};
exports.authorize = () => {
    return (req, res, next) => {
        if (!(req.user && req.user.role=='admin')) {
            return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
        }   
        next();
    };
};

