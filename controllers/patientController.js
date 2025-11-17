const Patient = require('../models/patientModel');
const asyncHandler = require('express-async-handler');

exports.getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find().populate('user', 'email');
    res.json(patients);
});

exports.getPatientById = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id).populate('user', 'email');
    
    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    res.json(patient);
});

exports.createPatient = asyncHandler(async (req, res) => {
    const { userId, name, age, diagnoses, medications } = req.body;

    const patient = await Patient.create({
        user: userId,
        name,
        age,
        diagnoses,
        medications: Array.isArray(medications) ? medications : (medications ? medications.split(',').map(m => m.trim()) : [])
    });

    res.status(201).json(patient);
});

exports.updatePatient = asyncHandler(async (req, res) => {
    const { name, age, diagnoses, medications } = req.body;

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }
    
    let updated = false;

    if (name && name !== patient.name) {
        patient.name = name;
        updated = true;
    }
    if (age && age !== patient.age) {
        patient.age = age;
        updated = true;
    }
    if (diagnoses && diagnoses !== patient.diagnoses) {
        patient.diagnoses = diagnoses;
        updated = true;
    }
    
    if (medications !== undefined) {
        const newMeds = Array.isArray(medications) ? medications : (medications ? medications.split(',').map(m => m.trim()) : []);
        if (JSON.stringify(patient.medications) !== JSON.stringify(newMeds)) {
            patient.medications = newMeds;
            updated = true;
        }
    }

    if (!updated) {
        return res.json({ status: 'already', message: 'No changes detected' });
    }
    
    await patient.save();
    res.json({ status: 'success', message: 'Patient updated successfully', patient });
});

exports.deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    await patient.deleteOne();
    res.json({ status: 'success', message: 'Patient removed' });
});