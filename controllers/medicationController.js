const Medication = require('../models/Medication');
const Doctor = require('../models/Doctor');
const asyncHandler = require('express-async-handler');

exports.createMedication = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'doctor'&& user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const { name, description ,sideEffects,dosage } = req.body;
    const medication = new Medication({ name, description ,sideEffects,dosage });
    await medication.save();
    res.status(201).json(medication);
});

exports.getMedicationById = asyncHandler(async (req, res) => {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(200).json(medication);
});

exports.updateMedication = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'doctor' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const { name, description ,sideEffects,dosage } = req.body;
    const medication = await Medication.findByIdAndUpdate(
        req.params.id,
        { name, description ,sideEffects,dosage },
        { new: true }
    );
    if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(200).json(medication);
});

exports.deleteMedication = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'doctor'&& user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const medication = await Medication.findByIdAndDelete(req.params.id);
    if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(200).json({ message: 'Medication deleted successfully' });
});

exports.getAllMedications = asyncHandler(async (req, res) => {
    const medications = await Medication.find();
    res.status(200).json(medications);
});
module.exports = {
    getAllMedications: exports.getAllMedications,
    createMedication: exports.createMedication,
    getMedicationById: exports.getMedicationById,
    updateMedication: exports.updateMedication,
    deleteMedication: exports.deleteMedication
};
