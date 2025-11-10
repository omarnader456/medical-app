const express = require('express');
const { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const {adminOnly,
    nurseOnly,
    doctorsOnly,
    adminOrNurse,
    adminOrDoctor,
    nurseOrDoctor,
    allRoles}=require('../middleware/roleMiddleware');
const Patient = require('../models/patientModel');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllMedications,
    createMedication,
    getMedicationById,
    updateMedication,
    deleteMedication}=require('../controllers/medicationController')
const {deleteMedicaTime,updateMedicaTime,getMedicaTimeById,createMedicaTime,getAllMedicaTimes}=require('../controllers/meditimesController')
const {    getAssignments,
    getAssignmentById} =require('../controllers/assignpatController');
const { body,param, validationResult } = require('express-validator');

router.use(protect);
router.get('/', protect,getDoctors);
router.post('/', protect,authorize, (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },createDoctor);
router.get('/:id', protect,param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getDoctorById);
router.put('/:id',protect, authorize,(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },updateDoctor);
router.delete('/:id', protect,authorize, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),deleteDoctor);
router.get('/medications',protect, (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },getAllMedications);
router.post('/medications', protect,(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },createMedication);
router.get('/medications/:id',protect, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getMedicationById);
router.put('/medications/:id', protect,(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },updateMedication);
router.delete('/medications/:id',protect, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),deleteMedication);
router.get('/medicatimes',protect,getAllMedicaTimes);
router.post('/medicatimes',protect,doctorsOnly(), (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },createMedicaTime);
router.get('/medicatimes/:id', protect,param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getMedicaTimeById);
router.put('/medicatimes/:id', protect,doctorsOnly, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },updateMedicaTime);
router.delete('/medicatimes/:id', protect,doctorsOnly(), param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),deleteMedicaTime);
router.get('/assignments',protect,getAssignments);
router.get('/assignments/:id', protect,param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getAssignmentById);



module.exports = router;