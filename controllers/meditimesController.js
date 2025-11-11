const MedicaTimes = require('../models/meditimesModel');
const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');
const Medication = require('../models/medicationModel');
const { getAssignmentById } = require('./assignpatController');


exports.getAllMedicaTimes = asyncHandler(async (req, res) => {
    const medicaTimes = await MedicaTimes.find()
        .populate('patient', 'name _id')
        .populate('medication', 'name dosage');
    res.status(200).json(medicaTimes);
});

exports.createMedicaTime = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'doctor') return res.status(403).json({ message: 'Access denied' });


    const assignment = await getAssignmentById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const { pat, times, med } = req.body;
    const patient = await Patient.findOne({ name: pat });
    const medication = await Medication.findOne({ name: med });

    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    if (!medication) return res.status(404).json({ message: 'Medication not found' });

    if (assignment.assigneddoc._id.toString() !== user._id.toString() ||
        assignment.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const newMedicaTime = new MedicaTimes({ patient: patient._id, medication: medication._id, times });
    await newMedicaTime.save();
    res.status(201).json(newMedicaTime);
});

exports.getMedicaTimeById = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'doctor' && user.role !== 'nurse') return res.status(403).json({ message: 'Access denied' });

    const medicaTime = await MedicaTimes.findById(req.params.id);
    
    if (!medicaTime) return res.status(404).json({ message: 'MedicaTime not found' });

    res.status(200).json(medicaTime);
});

exports.updateMedicaTime = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'doctor') return res.status(403).json({ message: 'Access denied' });

    const assignment = await getAssignmentById(req.params.id);
    if (!assignment || assignment.assigneddoc._id.toString() !== user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
    }

    const medicaTime = await MedicaTimes.findByIdAndUpdate(
        req.params.id,
        { times: req.body.times },
        { new: true }
    );

    if (!medicaTime) return res.status(404).json({ message: 'MedicaTime not found' });
    res.status(200).json(medicaTime);
});

exports.deleteMedicaTime = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'doctor') return res.status(403).json({ message: 'Access denied' });

    const assignment = await getAssignmentById(req.params.id);
    if (!assignment || assignment.assigneddoc._id.toString() !== user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
    }

    const medicaTime = await MedicaTimes.findByIdAndDelete(req.params.id);
    if (!medicaTime) return res.status(404).json({ message: 'MedicaTime not found' });

    res.status(200).json({ message: 'MedicaTime deleted successfully' });
});

module.exports = {
    getAllMedicaTimes: exports.getAllMedicaTimes,
    createMedicaTime: exports.createMedicaTime,
    getMedicaTimeById: exports.getMedicaTimeById,
    updateMedicaTime: exports.updateMedicaTime,
    deleteMedicaTime: exports.deleteMedicaTime
};