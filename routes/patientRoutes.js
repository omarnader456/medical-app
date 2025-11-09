const express = require('express');
const { getPatients, getPatientById, createPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {doctorandnurseOnly,adminonly,doctorsOnly,nurseOnly,adminOrDoctor,adminOrNurse,nurseOrDoctor,allRoles} = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/',getPatients);
router.post('/', authorize(), adminonly(),createPatient);
router.get('/:id', authorize(), getPatientById);
router.put('/:id',  adminOrDoctor(),updatePatient);
router.delete('/:id', authorize(), adminonly(),deletePatient);

module.exports = router;