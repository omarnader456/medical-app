const express = require('express');
const { getPatients, getPatientById, createPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { adminOrDoctor, doctorsOnly } = require('../middleware/roleMiddleware');
const { getAssignments, getAssignmentById, getpatassignment} = require('../controllers/assignpatController');
const { getAllMedicaTimes, getMedicaTimeById } = require('../controllers/meditimesController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { param, validationResult } = require('express-validator');
const {doctorPatientAccess, nursePatientAccess} = require('../middleware/patientAcces');
const { patientOnly } = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(protect);

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

router.get('/', adminOrDoctor, getPatients);
router.post('/', authorize, validate, createPatient); 
router.get(
    '/:id', 
    adminOrDoctor, 
    doctorPatientAccess, 
    [param('id').isMongoId()], 
    validate, 
    getPatientById
);
router.put(
    '/:id', 
    adminOrDoctor, 
    [param('id').isMongoId()], 
    validate, 
    updatePatient
); 
router.delete('/:id', authorize, [param('id').isMongoId()], deletePatient); 

router.get('/assignments', patientOnly, getAssignments); 
router.get('/assignment', patientOnly, getpatassignment); 
router.get('/assignments/:id', patientOnly, [param('id').isMongoId()], validate, getAssignmentById);


router.get('/medicatimes', patientOnly, getAllMedicaTimes);
router.get('/medicatimes/:id', patientOnly, [param('id').isMongoId()], validate, getMedicaTimeById);

module.exports = router;