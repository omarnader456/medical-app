const Medication = require('../models/medicationModel');
const asyncHandler = require('express-async-handler');

exports.getAllMedications = asyncHandler(async (req, res) => {
    const medications = await Medication.find({});
    res.json(medications);
});

exports.createMedication = asyncHandler(async (req, res) => {
    const { name, description, sideEffects, dosage } = req.body;
    
    const sideEffectsArray = Array.isArray(sideEffects) 
        ? sideEffects 
        : (sideEffects ? sideEffects.split(',').map(s => s.trim()) : []);

    const medication = await Medication.create({
        name,
        description,
        sideEffects: sideEffectsArray,
        dosage,
    });

    res.status(201).json(medication);
});

exports.getMedicationById = asyncHandler(async (req, res) => {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
        res.status(404);
        throw new Error('Medication not found');
    }
    res.json(medication);
});

exports.updateMedication = asyncHandler(async (req, res) => {
    const { name, description, sideEffects, dosage } = req.body;
    
    const medication = await Medication.findById(req.params.id);
    
    if (!medication) {
        res.status(404);
        throw new Error('Medication not found');
    }

    let updated = false;

    if (name && name !== medication.name) {
        medication.name = name;
        updated = true;
    }
    if (description && description !== medication.description) {
        medication.description = description;
        updated = true;
    }
    if (dosage && dosage !== medication.dosage) {
        medication.dosage = dosage;
        updated = true;
    }
    
    if (sideEffects !== undefined) {
        const newSideEffects = Array.isArray(sideEffects) 
            ? sideEffects 
            : (sideEffects ? sideEffects.split(',').map(s => s.trim()) : []);
            
        if (JSON.stringify(medication.sideEffects) !== JSON.stringify(newSideEffects)) {
            medication.sideEffects = newSideEffects;
            updated = true;
        }
    }

    if (!updated) {
        return res.json({ status: 'already', message: 'No changes detected' });
    }

    await medication.save();
    res.json({ status: 'success', message: 'Medication updated successfully', medication });
});

exports.deleteMedication = asyncHandler(async (req, res) => {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
        res.status(404);
        throw new Error('Medication not found');
    }

    await medication.deleteOne();
    res.json({ status: 'success', message: 'Medication removed' });
});