const express = require('express');
const { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const Patient = require('../models/patientModel');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', authorize(), getDoctors);
router.post('/', authorize(), createDoctor);
router.get('/:id', authorize(), getDoctorById);
router.put('/:id', authorize(), updateDoctor);
router.delete('/:id', authorize(), deleteDoctor);


module.exports = router;