const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    let token = null;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

exports.authorize = async (req, res, next) => {
    if (req.user.role !=='admin') {
        return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
};



module.exports = { protect: exports.protect, authorize: exports.authorize };
