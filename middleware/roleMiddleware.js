
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ message: 'Access denied. Admin role required.' });
};

exports.doctorsOnly = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
        return next();
    }
    res.status(403).json({ message: 'Access denied. Doctor role required.' });
};

exports.nurseOnly = (req, res, next) => {
    if (req.user && req.user.role === 'nurse') {
        return next();
    }
    res.status(403).json({ message: 'Access denied. Nurse role required.' });
};

exports.adminOrDoctor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'doctor')) {
        return next();
    }
    res.status(403).json({ message: 'Access denied. Admin or Doctor role required.' });
};