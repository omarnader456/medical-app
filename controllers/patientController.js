const User = require('../models/userModel');
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Nurse = require('../models/nurseModel');
const Assignpat = require('../models/assignpatModel');
const asyncHandler = require('express-async-handler');


exports.getPatients = asyncHandler(async (req, res) => {
    try {
    const user=req.user;
    let patients;
    if (user.role === 'doctor') {
        const assigned = await Assignpat.find({ assigneddoc: user._id }).populate('patient');
        patients = assigned.map(a => a.patient);
    } else if (user.role === 'nurse') {
        const assigned = await Assignpat.find({ assignednurse: user._id }).populate('patient');
        patients = assigned.map(a => a.patient);
    }
    else if (user.role === 'admin') {
        patients = await Patient.find({}, 'name _id');
    }
    else {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(patients);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.createPatient = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const {name,age,diagnoses,medications} = req.body;
        const pat = await User.findOne({name:name});
        if(!pat || pat.role!=='patient') {
            return res.status(400).json({ message: 'Invalid patient user ID' });
        }
        const patient = await Patient.create({user:pat,name,age,diagnoses,medications});
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getPatientById = asyncHandler(async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)['name _id'];
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }   
});
exports.updatePatient = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deletePatient = asyncHandler(async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = { getPatients: exports.getPatients,
    createPatient: exports.createPatient,
    getPatientById: exports.getPatientById,
    updatePatient: exports.updatePatient,
    deletePatient: exports.deletePatient
};


