const express = require('express');
const { getNurses, getNurseById, createNurse, deleteNurse } = require('../controllers/nurseController');
const { getAssignments, getAssignmentById,getnurseassignment } = require('../controllers/assignpatController');
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

router.get('/', getNurses);
router.post('/', authorize, validate, createNurse);
router.get('/medicatimes', getAllMedicaTimes);
router.get('/assignments', getAssignments);
router.get('/assignment',getnurseassignment);
router.get('/:id', [param('id').notEmpty().isMongoId()], validate, getNurseById);
router.delete('/:id', authorize, deleteNurse);


router.get('/assignments/:id', [param('id').notEmpty().isMongoId()], validate, getAssignmentById);

router.get('/medicatimes/:id', [param('id').notEmpty().isMongoId()], validate, getMedicaTimeById);

module.exports = router;
