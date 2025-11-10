const MedicaTimes = require('../models/meditimesModel');
const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');
const Medication = require('../models/Medication');
const {getAssignmentById} =require('./assignpatController');
const asyncHandler = require('express-async-handler');



exports.createMedicaTime = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role!=='doctor'){
        return res.status(403).json({message: 'Access denied'});
    }
    const assignmet=await getAssignmentById(req.params.id);
    const { pat,times, med } = req.body;
    if (!assignmet){
        return res.status(404).json({message: 'Assignment not found'});
    }
    patient=await Patientfindone({name:pat});
    if (assignmet.assigneddoc._id.toString()!==user._id.toString() && assignment.patient._id.toString()!==patient._id.toString()){
        return res.status(403).json({message: 'Access denied'});
    }
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
    const user = req.user;
    if (user.role!=='doctor' && user.role!=='nurse'){
        return res.status(403).json({message: 'Access denied'});
    }
    const medicaTime = await MedicaTimes.findById(req.params.id);
    const assignmet=await getAssignmentById(req.params.id);
    if (assignmet.assigneddoc._id.toString()!==user._id.toString() || assignmet.assignednurse._id.toString()!==user._id.toString()){
        return res.status(403).json({message: 'Access denied'});
    }
    if (!medicaTime) {
        return res.status(404).json({ message: 'MedicaTime not found' });
    }
    if (medicaTime.patient.toString()!==assignmet.patient.toString()){
        return res.status(403).json({message: 'Access denied'});
    }
    res.status(200).json(medicaTime);
});
exports.updateMedicaTime = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role!=='doctor'){
        return res.status(403).json({message: 'Access denied'});
    }
    const assignmet=await getAssignmentById(req.params.id);
    if (assignmet.assigneddoc._id.toString()!==user._id.toString()){
        return res.status(403).json({message: 'Access denied'});
    }
    const {patient_name, time, description } = req.body;
    const patient=await Patient.findById(patient_name)


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
    const assignmet=await getAssignmentById(req.params.id);
    if (assignmet.assigneddoc._id.toString()!==user._id.toString()){
        return res.status(403).json({message: 'Access denied'});
    }
    const pat_name=req.body.pat_name;
    const patient=await Patient.findOne({name:pat_name});
    if (assignmet.patient._id.toString()!==patient._id.toString()){
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
    const assignment = await getAssignmentById(req.params.id);
    if (assignment.assigneddoc._id.toString()!==user._id.toString() || assignment.assignednurse._id.toString()!==user._id.toString()){
        return res.status(403).json({message: 'Access denied'});
    }
    const patient_name=req.body.patient_name;
    const patient=await Patient.findOne({name:patient_name});
    if (assignment.patient._id.toString()!==patient._id.toString()){
        return res.status(403).json({message: 'Access denied'});
    }
    const medicaTimes = await MedicaTimes.find(patient);
    res.status(200).json(medicaTimes);
});

module.exports = {
    getAllMedicaTimes: exports.getAllMedicaTimes,
    createMedicaTime: exports.createMedicaTime,
    getMedicaTimeById: exports.getMedicaTimeById,
    updateMedicaTime: exports.updateMedicaTime,
    deleteMedicaTime: exports.deleteMedicaTime
};