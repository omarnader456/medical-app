const User =require('../models/userModel');
const Nurse = require('../models/nurseModel');


exports.createNurse = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { luser, name, department } = req.body;
        const luserid = await User.findById(luser);
        if (!luserid || luserid.role !== 'nurse') {
            return res.status(400).json({ message: 'Invalid nurse user ID' });
        }
        const nurse = await Nurse.create({ user: luser, name, department });
        res.status(201).json(nurse);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getNurses = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const nurses = await Nurse.find({}, 'name _id department');
        res.status(200).json(nurses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getNurseById = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const nurse = await Nurse.findById(req.params.id);
        if (!nurse) {
            return res.status(404).json({ message: 'Nurse not found' });
        }
        res.status(200).json(nurse);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteNurse = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const nurse = await Nurse.findByIdAndDelete(req.params.id);
        if (!nurse) {
            return res.status(404).json({ message: 'Nurse not found' });
        }
        res.status(200).json({ message: 'Nurse deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = { createNurse: exports.createNurse, getNurses: exports.getNurses, getNurseById: exports.getNurseById, deleteNurse: exports.deleteNurse };