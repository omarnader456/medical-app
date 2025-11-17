const express = require('express');
const { getNurses, getNurseById, createNurse, deleteNurse } = require('../controllers/nurseController');
const { getAssignments, getAssignmentById, getnurseassignment } = require('../controllers/assignpatController');
const { getAllMedicaTimes, getMedicaTimeById } = require('../controllers/meditimesController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { nurseOnly } = require('../middleware/roleMiddleware');
const { param, validationResult } = require('express-validator');

const router = express.Router();
router.use(protect); 

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

router.get('/', getNurses);
router.post('/', authorize, validate, createNurse); 
router.get('/:id', [param('id').isMongoId()], validate, getNurseById);
router.delete('/:id', authorize, [param('id').isMongoId()], deleteNurse); 

router.get('/assignments', nurseOnly, getAssignments); 
router.get('/assignment', nurseOnly, getnurseassignment);
router.get('/assignments/:id', nurseOnly, [param('id').isMongoId()], validate, getAssignmentById);

router.get('/medicatimes', nurseOnly, getAllMedicaTimes);
router.get('/medicatimes/:id', nurseOnly, [param('id').isMongoId()], validate, getMedicaTimeById);

module.exports = router;