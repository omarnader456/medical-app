const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const asyncHandler = require('express-async-handler');

exports.getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({}, 'name _id speciality');
    res.status(200).json(doctors);
});

exports.createDoctor = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { name, speciality } = req.body;
    const dctr = await User.findOne({ name });
    if (!dctr || dctr.role !== 'doctor') {
        return res.status(400).json({ message: 'Invalid doctor user ID' });
    }

    const doctor = await Doctor.create({ user: dctr._id, name, speciality });
    res.status(201).json(doctor);
});

exports.getDoctorById = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json(doctor);
});

exports.deleteDoctor = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    res.status(200).json({ message: 'Doctor deleted successfully' });
});

exports.updateDoctor = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    res.status(200).json(doctor);
});

module.exports = {
    getDoctors: exports.getDoctors,
    createDoctor: exports.createDoctor,
    getDoctorById: exports.getDoctorById,
    deleteDoctor: exports.deleteDoctor,
    updateDoctor: exports.updateDoctor
};
