const Doctor = require('../models/doctorModel');
const asyncHandler = require('express-async-handler');

exports.getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find().populate('user', 'email');
    res.json(doctors);
});

exports.getDoctorById = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'email');
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }
    res.json(doctor);
});

exports.createDoctor = asyncHandler(async (req, res) => {
    const { userId, name, specialty } = req.body;

    const doctor = await Doctor.create({
        user: userId,
        name,
        specialty,
    });

    res.status(201).json(doctor);
});

exports.updateDoctor = asyncHandler(async (req, res) => {
    const { name, specialty } = req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }
    
    let updated = false;
    if (name && name !== doctor.name) {
        doctor.name = name;
        updated = true;
    }
    if (specialty && specialty !== doctor.specialty) {
        doctor.specialty = specialty;
        updated = true;
    }

    if (!updated) {
        return res.json({ status: 'already', message: 'No changes detected' });
    }
    
    await doctor.save();
    res.json({ status: 'success', message: 'Doctor updated successfully', doctor });
});

exports.deleteDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }

    await doctor.deleteOne();
    res.json({ status: 'success', message: 'Doctor removed' });
});