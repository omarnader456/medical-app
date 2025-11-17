const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.clearCookie('token');
            res.status(401);
            throw new Error('Not authorized, user not found');
        }

        next();
    } catch (error) {
        res.clearCookie('token');
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

exports.authorize = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ message: 'Not authorized as an admin' });
};