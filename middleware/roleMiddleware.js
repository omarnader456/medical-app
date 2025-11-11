

// Checks if user role matches a single allowed role
const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
};

// Single-role checks
const adminOnly = roleCheck(['admin']);
const nurseOnly = roleCheck(['nurse']);
const doctorsOnly = roleCheck(['doctor']);

// Multi-role combinations
const adminOrNurse = roleCheck(['admin', 'nurse']);
const adminOrDoctor = roleCheck(['admin', 'doctor']);
const nurseOrDoctor = roleCheck(['nurse', 'doctor']);
const allRoles = roleCheck(['admin', 'nurse', 'doctor', 'patient']);

module.exports = {
  adminOnly,
  nurseOnly,
  doctorsOnly,
  adminOrNurse,
  adminOrDoctor,
  nurseOrDoctor,
  allRoles
};
