const asyncHandler = require('express-async-handler');
const Assignpat = require('../models/assignpatModel');
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Nurse = require('../models/nurseModel');

exports.doctorPatientAccess = asyncHandler(async (req, res, next) => {
    const patientId = req.params.id;
    const doctorUserId = req.user._id;

    const doctor = await Doctor.findOne({ user: doctorUserId });

    if (!doctor) {
        res.status(403);
        throw new Error('Doctor profile not found.');
    }

    const assignment = await Assignpat.findOne({
        patient: patientId,
        assigneddoc: doctor._id
    });

    if (!assignment && req.user.role !== 'admin') { 
        res.status(403);
        throw new Error('Access denied. Patient not assigned to this doctor.');
    }

    next();
});

exports.nursePatientAccess = asyncHandler(async (req, res, next) => {
    const patientId = req.params.id;
    const nurseUserId = req.user._id;

    const nurse = await Nurse.findOne({ user: nurseUserId });

    if (!nurse) {
        res.status(403);
        throw new Error('Nurse profile not found.');
    }

    const assignment = await Assignpat.findOne({
        patient: patientId,
        assignednurse: nurse._id
    });

    if (!assignment && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Access denied. Patient not assigned to this nurse.');
    }

    next();
});