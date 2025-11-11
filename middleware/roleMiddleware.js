function roleCheck(requiredRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

const adminOnly = roleCheck(['admin']);
const nurseOnly = roleCheck(['nurse']);
const doctorsOnly = roleCheck(['doctor']);
const adminOrNurse = roleCheck(['admin', 'nurse']);
const adminOrDoctor = roleCheck(['admin', 'doctor']);
const nurseOrDoctor = roleCheck(['nurse', 'doctor']);
const allRoles = roleCheck(['admin', 'nurse', 'doctor']);

module.exports = {
  adminOnly,
  nurseOnly,
  doctorsOnly,
  adminOrNurse,
  adminOrDoctor,
  nurseOrDoctor,
  allRoles
};
