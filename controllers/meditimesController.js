const MediTimes = require('../models/meditimesModel');
const Medication = require('../models/medicationModel');
const Patient = require('../models/patientModel');
const Assignpat = require('../models/assignpatModel');
const asyncHandler = require('express-async-handler');

exports.getAllMedicaTimes = asyncHandler(async (req, res) => {
    const userRole = req.user.role;
    let query = {};
    
    
    const medTimes = await MediTimes.find(query).populate('medication', 'name dosage').populate('patient', 'name');
    res.json(medTimes);
});

exports.createMedicaTime = asyncHandler(async (req, res) => {
    const { assignmentId } = req.params;
    const { medicationId, times } = req.body; 
    
    const assignment = await Assignpat.findById(assignmentId);
    if (!assignment) {
        res.status(404);
        throw new Error('Assignment not found');
    }
    const patientId = assignment.patient;

    const medication = await Medication.findById(medicationId);
    if (!medication) {
        res.status(404);
        throw new Error('Medication not found');
    }

    const timesArray = Array.isArray(times) 
        ? times 
        : (times ? times.split(',').map(t => t.trim()) : []);

    const mediTime = await MediTimes.create({
        patient: patientId,
        medication: medicationId,
        times: timesArray
    });

    res.status(201).json(mediTime);
});

exports.getMedicaTimeById = asyncHandler(async (req, res) => {
    const medTime = await MediTimes.findById(req.params.id)
        .populate('medication', 'name description dosage')
        .populate('patient', 'name');
        
    if (!medTime) {
        res.status(404);
        throw new Error('Medication time not found');
    }
    

    res.json(medTime);
});

exports.updateMedicaTime = asyncHandler(async (req, res) => {
    const { times } = req.body;
    
    const mediTime = await MediTimes.findById(req.params.id);
    
    if (!mediTime) {
        res.status(404);
        throw new Error('Medication time not found');
    }

    const newTimesArray = Array.isArray(times) 
        ? times 
        : (times ? times.split(',').map(t => t.trim()) : []);
        
    if (JSON.stringify(mediTime.times) === JSON.stringify(newTimesArray)) {
        return res.json({ status: 'already', message: 'No changes detected' });
    }

    mediTime.times = newTimesArray;
    await mediTime.save();
    
    res.json({ status: 'success', message: 'Medication time updated successfully', mediTime });
});

exports.deleteMedicaTime = asyncHandler(async (req, res) => {
    const mediTime = await MediTimes.findById(req.params.id);

    if (!mediTime) {
        res.status(404);
        throw new Error('Medication time not found');
    }

    
    await mediTime.deleteOne();
    res.json({ status: 'success', message: 'Medication time removed' });
});