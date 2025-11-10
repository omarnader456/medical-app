const express = require('express');
const { getPatients, getPatientById, createPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {doctorandnurseOnly,adminonly,doctorsOnly,nurseOnly,adminOrDoctor,adminOrNurse,nurseOrDoctor,allRoles} = require('../middleware/roleMiddleware');
const {    getAssignments,
    getAssignmentById} = require('../controllers/assignpatController');
const {getAllMedicaTimes,getMedicaTimeById}=require('../controllers/meditimesController')
const { body,param, validationResult } = require('express-validator');



router.get('/',protect,getPatients);
router.post('/', protect,authorize,(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },createPatient);
router.get('/:id',protect, authorize, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getPatientById);
router.put('/:id', protect, adminOrDoctor(),param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },updatePatient);
router.delete('/:id', protect,authorize,param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),deletePatient);
router.get('/assignments', protect,getAssignments);
router.get('/assignments/:id', protect,param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getAssignmentById);
router.get('/medicatimes', protect,getAllMedicaTimes);
router.get('/medicatimes/:id', protect,param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getMedicaTimeById);

module.exports = router;