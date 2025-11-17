const express = require('express');
const { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { adminOnly, nurseOnly, doctorsOnly } = require('../middleware/roleMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllMedications, createMedication, getMedicationById, updateMedication, deleteMedication } = require('../controllers/medicationController');
const { deleteMedicaTime, updateMedicaTime, getMedicaTimeById, createMedicaTime, getAllMedicaTimes } = require('../controllers/meditimesController');
const { getAssignments, getAssignmentById } = require('../controllers/assignpatController');
const { param, validationResult } = require('express-validator');

const router = express.Router();
router.use(protect);

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

router.get('/assignments', getAssignments);
router.get('/assignments', protect, async (req, res) => {
    try {
        const doctorId = req.headers["x-user-id"];

        if (!doctorId)
            return res.status(400).json({ message: "User ID missing" });

        const assignments = await Assignment.find({
            assigneddoc: doctorId
        }).populate("patient");

        res.json(assignments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/medications', validate, getAllMedications);
router.post('/medications', validate, createMedication);
router.get('/medicatimes', getAllMedicaTimes);
router.get('/', getDoctors);
router.post('/', authorize, validate, createDoctor);


router.get('/:id', [param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id')], validate, getDoctorById);
router.put('/:id', authorize, [param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id')], validate, updateDoctor);
router.delete('/:id', authorize, [param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id')], deleteDoctor);


router.get('/medications/:id', [param('id').notEmpty().isMongoId()], validate, getMedicationById);
router.put('/medications/:id', [param('id').notEmpty().isMongoId()], validate, updateMedication);
router.delete('/medications/:id', [param('id').notEmpty().isMongoId()], deleteMedication);

router.post('/medicatimes/:id', doctorsOnly, validate, createMedicaTime);
router.get('/medicatimes/:id', [param('id').notEmpty().isMongoId()], validate, getMedicaTimeById);
router.put('/medicatimes/:id', doctorsOnly, [param('id').notEmpty().isMongoId()], validate, updateMedicaTime);
router.delete(
  '/medicatimes/:id/:assignid',
  (req, res, next) => {
    console.log("Route Params:", req.params);
    next();
  },
  doctorsOnly,
  param('id').isMongoId(),
  param('assignid').isMongoId(),
  validate,
  deleteMedicaTime
);



router.get('/assignments/:id', [param('id').notEmpty().isMongoId()], validate, getAssignmentById);

module.exports = router;