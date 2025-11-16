const Assignment = require("../models/assignmentsModel");  

module.exports = async function doctorPatientAccess(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const patientId = req.params.id || req.body.Pid;
        if (!patientId) {
            return res.status(400).json({ message: "Patient ID missing" });
        }
        const assignment = await Assignment.findOne({
            patient: patientId,
            assigneddoc: req.user._id
        });

        if (!assignment) {
            return res.status(403).json({ message: "Doctor not assigned to this patient" });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error checking doctor-patient relation" });
    }
};

module.exports = async function nursePatientAccess(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const patientId = req.params.id || req.body.Pid;
        if (!patientId) {
            return res.status(400).json({ message: "Patient ID missing" });
        }
        const assignment = await Assignment.findOne({
            patient: patientId,
            assignednurse: req.user._id
        });

        if (!assignment) {
            return res.status(403).json({ message: "Doctor not assigned to this patient" });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error checking doctor-patient relation" });
    }
};


module.exports = {
    doctorPatientAccess:exports.doctorPatientAccess,
    nursePatientAccess:exports.nursePatientAccess
}