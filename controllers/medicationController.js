const Medication = require('../models/medicationModel');
const asyncHandler = require('express-async-handler');

exports.createMedication = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'doctor' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, sideEffects, dosage } = req.body;
    const medication = new Medication({ name, description, sideEffects, dosage });
    await medication.save();

    res.status(201).json(medication);
});

exports.getMedicationById = asyncHandler(async (req, res) => {
    const medication = await Medication.findById(req.params.id);
    if (!medication) return res.status(404).json({ message: 'Medication not found' });

    res.status(200).json(medication);
});

exports.updateMedication = asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.role !== 'doctor' && user.role !== 'admin') {
        return res.status(403).json({ status: "error", message: 'Access denied' });
    }
    const { id } = req.params.id;
    const medication = await Medication.findById(id);
    if (!medication) {
        return res.status(404).json({ status: "error", message: 'Medication not found' });
    }
    const { name, description, sideEffects, dosage } = req.body;
    const updates = {};
    const changedFields = [];
    if (name !== undefined && name.trim() !== medication.name) {
        updates.name = name.trim();
        changedFields.push("name");
    }
    if (description !== undefined && description.trim() !== medication.description) {
        updates.description = description.trim();
        changedFields.push("description");
    }
    if (sideEffects !== undefined && sideEffects.trim() !== medication.sideEffects) {
        updates.sideEffects = sideEffects.trim();
        changedFields.push("sideEffects");
    }
    if (dosage !== undefined && dosage.trim() !== medication.dosage) {
        updates.dosage = dosage.trim();
        changedFields.push("dosage");
    }
    if (changedFields.length === 0) {
        return res.status(200).json({
            status: "already",
            message: "No changes detected. Already updated.",
        });
    }
    const updated = await Medication.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    );

    return res.status(200).json({
        status: "success",
        message: "Medication updated successfully",
        updated
    });
});


exports.deleteMedication = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'doctor' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const medication = await Medication.findByIdAndDelete(req.params.id);
    if (!medication) return res.status(404).json({ message: 'Medication not found' });

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
