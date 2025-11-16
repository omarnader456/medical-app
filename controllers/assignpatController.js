const Nurse = require('../models/nurseModel');
const Doctor = require('../models/doctorModel');
const Assignpat = require('../models/assignpatModel');
const Patient = require('../models/patientModel');
const asyncHandler = require('express-async-handler');

exports.assignPatient = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { patientId, doctorId, nurseId } = req.body;

    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);
    const nurse = await Nurse.findById(nurseId);

    if (!patient || !doctor || !nurse) {
        return res.status(400).json({ message: 'Invalid IDs provided' });
    }

    const assignment = await Assignpat.create({
        patient: patientId,
        assigneddoc: doctorId,
        assignednurse: nurseId
    });

    res.status(201).json(assignment);
});

exports.getAssignments = asyncHandler(async (req, res) => {
    console.log("Params:", req.params);
    console.log("Path:", req.path);
    console.log("Original URL:", req.originalUrl);
    const assignments = await Assignpat.find()
        .populate('patient', 'name _id')
        .populate('assigneddoc', 'name _id')
        .populate('assignednurse', 'name _id');

    res.status(200).json(assignments);
});

exports.getAssignmentById = asyncHandler(async (req, res) => {
    const assignment = await Assignpat.findById(req.params.id)
        .populate('patient', 'name _id')
        .populate('assigneddoc', 'name _id')
        .populate('assignednurse', 'name _id');

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    res.status(200).json(assignment);
});

exports.deleteAssignment = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const assignment = await Assignpat.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    res.status(200).json({ message: 'Assignment deleted successfully' });
});

module.exports = {
    assignPatient: exports.assignPatient,
    getAssignments: exports.getAssignments,
    getAssignmentById: exports.getAssignmentById,
    deleteAssignment: exports.deleteAssignment
};
