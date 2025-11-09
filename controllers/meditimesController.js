const MedicaTimes = require('../models/meditimesModel');
const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');
const Medication = require('../models/Medication');
const { get } = require('mongoose');


exports.createMedicaTime = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role!=='doctor'){
        return res.status(403).json({message: 'Access denied'});
    }
    const { pat,times, med } = req.body;
    const patient=await Patient.findById(pat)
    medication=await Medication.findById(med);

    if(!patient){
        return res.status(404).json({message: 'Patient not found'});
    }
    if(!medication){
        return res.status(404).json({message: 'Medication not found'});
    }
    const newMedicaTime = new MedicaTimes({ patient,medication,times  });
    await newMedicaTime.save();
    res.status(201).json(newMedicaTime);
});
exports.getMedicaTimeById = asyncHandler(async (req, res) => {
    const medicaTime = await MedicaTimes.findById(req.params.id);
    if (!medicaTime) {
        return res.status(404).json({ message: 'MedicaTime not found' });
    }
    res.status(200).json(medicaTime);
});
exports.updateMedicaTime = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role!=='doctor'){
        return res.status(403).json({message: 'Access denied'});
    }
    const { time, description } = req.body;
    const medicaTime = await MedicaTimes.findByIdAndUpdate(
        req.params.id,
        { times},
        { new: true }
    );
    if (!medicaTime) {
        return res.status(404).json({ message: 'MedicaTime not found' });
    }
    res.status(200).json(medicaTime);
});
exports.deleteMedicaTime = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role!=='doctor'){
        return res.status(403).json({message: 'Access denied'});
    }
    const medicaTime = await MedicaTimes.findByIdAndDelete(req.params.id);
    if (!medicaTime) {
        return res.status(404).json({ message: 'MedicaTime not found' });
    }
    res.status(200).json({ message: 'MedicaTime deleted successfully' });
});

getAllMedicaTimes = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role!=='doctor' && user.role!=='nurse'){
        return res.status(403).json({message: 'Access denied'});
    }
    const medicaTimes = await MedicaTimes.find();
    res.status(200).json(medicaTimes);
});

module.exports = {
    getAllMedicaTimes: exports.getAllMedicaTimes,
    createMedicaTime: exports.createMedicaTime,
    getMedicaTimeById: exports.getMedicaTimeById,
    updateMedicaTime: exports.updateMedicaTime,
    deleteMedicaTime: exports.deleteMedicaTime
};