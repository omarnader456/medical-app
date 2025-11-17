const express = require('express');
const { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { doctorsOnly } = require('../middleware/roleMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllMedications, createMedication, getMedicationById, updateMedication, deleteMedication } = require('../controllers/medicationController');
const { deleteMedicaTime, updateMedicaTime, getMedicaTimeById, createMedicaTime, getAllMedicaTimes } = require('../controllers/meditimesController');
const { getAssignments, getAssignmentById } = require('../controllers/assignpatController');
const { param, validationResult, body } = require('express-validator');

const router = express.Router();
router.use(protect); 

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};


router.get('/', getDoctors);
router.post('/', authorize, validate, createDoctor); 
router.get('/:id', [param('id').isMongoId()], validate, getDoctorById);
router.put('/:id', authorize, [param('id').isMongoId()], validate, updateDoctor); 
router.delete('/:id', authorize, [param('id').isMongoId()], deleteDoctor); 


router.get('/assignments', doctorsOnly, getAssignments); 
router.get('/assignments/:id', doctorsOnly, [param('id').isMongoId()], validate, getAssignmentById);


router.get('/medications', doctorsOnly, getAllMedications);
router.post(
    '/medications', 
    doctorsOnly, 
    [body('name').notEmpty(), body('dosage').notEmpty()],
    validate, 
    createMedication
);
router.get('/medications/:id', doctorsOnly, [param('id').isMongoId()], validate, getMedicationById);
router.put(
    '/medications/:id', 
    doctorsOnly, 
    [param('id').isMongoId()], 
    validate, 
    updateMedication
);
router.delete(
    '/medications/:id', 
    doctorsOnly, 
    [param('id').isMongoId()], 
    deleteMedication
);


router.get('/medicatimes', doctorsOnly, getAllMedicaTimes); 
router.post(
    '/medicatimes/:assignmentId', 
    doctorsOnly, 
    [param('assignmentId').isMongoId(), body('medicationId').isMongoId(), body('times').notEmpty()],
    validate, 
    createMedicaTime
);
router.get('/medicatimes/:id', doctorsOnly, [param('id').isMongoId()], validate, getMedicaTimeById);
router.put(
    '/medicatimes/:id', 
    doctorsOnly, 
    [param('id').isMongoId(), body('times').notEmpty()], 
    validate, 
    updateMedicaTime
);

router.delete(
    '/medicatimes/:id/:assignid',
    doctorsOnly,
    [param('id').isMongoId(), param('assignid').isMongoId()],
    validate,
    deleteMedicaTime
);

module.exports = router;