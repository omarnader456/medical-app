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

router.use(protect);
router.get('/', getDoctors);
router.post('/', authorize(), createDoctor);
router.get('/:id', getDoctorById);
router.put('/:id', authorize(), updateDoctor);
router.delete('/:id', authorize(), deleteDoctor);
router.get('/medications', getAllMedications);
router.post('/medications', authorize(), createMedication);
router.get('/medications/:id', getMedicationById);
router.put('/medications/:id', authorize(), updateMedication);
router.delete('/medications/:id', authorize(), deleteMedication);
router.get('/medicatimes', getAllMedicaTimes);
router.post('/medicatimes',doctorsOnly(), createMedicaTime);
router.get('/medicatimes/:id', getMedicaTimeById);
router.put('/medicatimes/:id', doctorsOnly(), updateMedicaTime);
router.delete('/medicatimes/:id', doctorsOnly(), deleteMedicaTime);



module.exports = router;