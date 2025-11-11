const User = require('../models/userModel');
const Nurse = require('../models/nurseModel');
const asyncHandler = require('express-async-handler');

exports.createNurse = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { name, department } = req.body;
    const nrs = await User.findOne({ name });
    if (!nrs || nrs.role !== 'nurse') return res.status(400).json({ message: 'Invalid nurse user ID' });

    const nurse = await Nurse.create({ user: nrs._id, name, department });
    res.status(201).json(nurse);
});

exports.getNurses = asyncHandler(async (req, res) => {
    const nurses = await Nurse.find({}, 'name _id department');
    res.status(200).json(nurses);
});

exports.getNurseById = asyncHandler(async (req, res) => {
    const nurse = await Nurse.findById(req.params.id);
    if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
    res.status(200).json(nurse);
});

exports.deleteNurse = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const nurse = await Nurse.findByIdAndDelete(req.params.id);
    if (!nurse) return res.status(404).json({ message: 'Nurse not found' });

    res.status(200).json({ message: 'Nurse deleted successfully' });
});

module.exports = {
    createNurse: exports.createNurse,
    getNurses: exports.getNurses,
    getNurseById: exports.getNurseById,
    deleteNurse: exports.deleteNurse
};
