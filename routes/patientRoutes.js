const express = require('express');
const { getPatients, getPatientById, createPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { doctorsOnly, adminOrDoctor } = require('../middleware/roleMiddleware');
const { getAssignments, getAssignmentById } = require('../controllers/assignpatController');
const { getAllMedicaTimes, getMedicaTimeById } = require('../controllers/meditimesController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { param, validationResult } = require('express-validator');

const router = express.Router();
router.use(protect);

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

router.get('/', getPatients);
router.post('/', authorize, validate, createPatient);
router.get('/:id', authorize, [param('id').notEmpty().isMongoId()], validate, getPatientById);
router.put('/:id', adminOrDoctor, [param('id').notEmpty().isMongoId()], validate, updatePatient); 
router.delete('/:id', authorize, [param('id').notEmpty().isMongoId()], deletePatient);

router.get('/assignments', getAssignments);
router.get('/assignments/:id', [param('id').notEmpty().isMongoId()], validate, getAssignmentById);

router.get('/medicatimes', getAllMedicaTimes);
router.get('/medicatimes/:id', [param('id').notEmpty().isMongoId()], validate, getMedicaTimeById);

module.exports = router;