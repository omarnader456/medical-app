const Assignpat = require('../models/assignpatModel');
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Nurse = require('../models/nurseModel');
const asyncHandler = require('express-async-handler');

const getRoleProfileId = async (userId, roleModel) => {
    const profile = await roleModel.findOne({ user: userId });
    if (!profile) throw new Error(`${roleModel.modelName} profile not found.`);
    return profile._id;
};

exports.assignPatient = asyncHandler(async (req, res) => {
    const { patientId, assigneddocId, assignednurseId } = req.body;

    const assignmentExists = await Assignpat.findOne({ patient: patientId });
    if (assignmentExists) {
        res.status(400);
        throw new Error('Patient is already assigned.');
    }

    const assignment = await Assignpat.create({
        patient: patientId,
        assigneddoc: assigneddocId,
        assignednurse: assignednurseId,
    });

    res.status(201).json(assignment);
});

exports.getAssignments = asyncHandler(async (req, res) => {
    const user = req.user;
    let query = {};
    const populateFields = [
        { path: 'patient', select: 'name age diagnoses' },
        { path: 'assigneddoc', select: 'name' },
        { path: 'assignednurse', select: 'name' }
    ];

    if (user.role === 'doctor') {
        const docId = await getRoleProfileId(user._id, Doctor);
        query = { assigneddoc: docId };
    } else if (user.role === 'nurse') {
        const nurseId = await getRoleProfileId(user._id, Nurse);
        query = { assignednurse: nurseId };
    } else if (user.role === 'patient') {
        const patientId = await getRoleProfileId(user._id, Patient);
        query = { patient: patientId };
    }

    const assignments = await Assignpat.find(query).populate(populateFields);
    res.json(assignments);
});

exports.getnurseassignment = asyncHandler(async (req, res) => {
    const nurseId = await getRoleProfileId(req.user._id, Nurse);
    
    const assignments = await Assignpat.find({ assignednurse: nurseId })
        .populate([
            { path: 'patient', select: 'name age' },
            { path: 'assigneddoc', select: 'name' }
        ]);
        
    res.json(assignments);
});

exports.getpatassignment = asyncHandler(async (req, res) => {
    const patientId = await getRoleProfileId(req.user._id, Patient);
    
    const assignment = await Assignpat.findOne({ patient: patientId })
        .populate([
            { path: 'assigneddoc', select: 'name specialty' },
            { path: 'assignednurse', select: 'name department' }
        ]);

    res.json(assignment ? [assignment] : []); 
});


exports.getAssignmentById = asyncHandler(async (req, res) => {
    const assignment = await Assignpat.findById(req.params.id)
        .populate([
            { path: 'patient', select: 'name age diagnoses' },
            { path: 'assigneddoc', select: 'name specialty' },
            { path: 'assignednurse', select: 'name department' }
        ]);

    if (!assignment) {
        res.status(404);
        throw new Error('Assignment not found');
    }

    if (req.user.role !== 'admin') {
        const userId = req.user._id;
        
        let profileId;
        if (req.user.role === 'doctor') profileId = await getRoleProfileId(userId, Doctor);
        if (req.user.role === 'nurse') profileId = await getRoleProfileId(userId, Nurse);
        if (req.user.role === 'patient') profileId = await getRoleProfileId(userId, Patient);

        const isAuthorized = (
            (req.user.role === 'doctor' && assignment.assigneddoc.equals(profileId)) ||
            (req.user.role === 'nurse' && assignment.assignednurse.equals(profileId)) ||
            (req.user.role === 'patient' && assignment.patient.equals(profileId))
        );

        if (!isAuthorized) {
            res.status(403);
            throw new Error('Access denied to this assignment');
        }
    }
    
    res.json(assignment);
});

exports.deleteAssignment = asyncHandler(async (req, res) => {
    const assignment = await Assignpat.findById(req.params.id);

    if (!assignment) {
        res.status(404);
        throw new Error('Assignment not found');
    }

    await assignment.deleteOne();

    res.json({ status: 'success', message: 'Assignment removed' });
});