const User =require('../models/userModel');
const Doctor = require('../models/doctorModel');
const asyncHandler = require('express-async-handler');

exports.getDoctors = asyncHandler(async (req, res) => {
    try {
        const doctors = await Doctor.find({}, 'name _id speciality');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.createDoctor = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { luser, name, speciality } = req.body;
        const luserid = await User.findById(luser);
        if (!luserid || luserid.role !== 'doctor') {
            return res.status(400).json({ message: 'Invalid doctor user ID' });
        }
        const doctor = await Doctor.create({ user: luser, name, speciality });
        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDoctorById = asyncHandler(async (req, res) => {
    try {
        const name=req.body.name;
        const id =await Doctor.findOne({name:name}).select('_id');
        if (!id){
            return res.status(404).json({message:'doctor no found'});
        }
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.deleteDoctor = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const name = req.body.name;
        const id= await Doctor.findOne({name:name}).select('_id');
        if (!id){
            return res.status(404).json({message:'doctor not found'});
        }
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateDoctor = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const name=req.body.name;
        const id=await Doctor.findOne({name:name}).select('_id');
        if (!id){
            res.status(404).json({message:'doctor not found'});
        }
        const doctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = {
    getDoctors: exports.getDoctors,
    createDoctor: exports.createDoctor,
    getDoctorById: exports.getDoctorById,
    deleteDoctor: exports.deleteDoctor,
    updateDoctor: exports.updateDoctor
};
