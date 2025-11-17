const Nurse = require('../models/nurseModel');
const asyncHandler = require('express-async-handler');

exports.getNurses = asyncHandler(async (req, res) => {
    const nurses = await Nurse.find().populate('user', 'email');
    res.json(nurses);
});

exports.getNurseById = asyncHandler(async (req, res) => {
    const nurse = await Nurse.findById(req.params.id).populate('user', 'email');
    if (!nurse) {
        res.status(404);
        throw new Error('Nurse not found');
    }
    res.json(nurse);
});

exports.createNurse = asyncHandler(async (req, res) => {
    const { userId, name, department } = req.body;

    const nurse = await Nurse.create({
        user: userId,
        name,
        department,
    });

    res.status(201).json(nurse);
});

exports.deleteNurse = asyncHandler(async (req, res) => {
    const nurse = await Nurse.findById(req.params.id);

    if (!nurse) {
        res.status(404);
        throw new Error('Nurse not found');
    }

    await nurse.deleteOne();
    res.json({ status: 'success', message: 'Nurse removed' });
});