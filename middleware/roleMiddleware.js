
exports.adminOnly = (req,res,next)=> {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

exports.nurseOnly = (req,res,next)=> {
    if (req.user.role !== 'nurse') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

exports.doctorsOnly = (req,res,next) => {
    if (req.user.role!=='doctor'){
        return res.status(403).json({message: 'Acess denied'});
    }
    next();
};

exports.adminOrNurse = (req,res,next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'nurse') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

exports.adminOrDoctor = (req,res,next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

exports.nurseOrDoctor = (req,res,next) => {
    if (req.user.role !== 'nurse' && req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};
exports.allRoles = (req,res,next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'nurse' && req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports = {
    adminOnly,
    nurseOnly,
    doctorsOnly,
    adminOrNurse,
    adminOrDoctor,
    nurseOrDoctor,
    allRoles
};



