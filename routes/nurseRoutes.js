const express = require('express');
const { getNurses, getNurseById, createNurse, updateNurse, deleteNurse } = require('../controllers/nurseController');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAssignments,
    getAssignmentById} = require('../controllers/assignpatController');
    const {getAllMedicaTimes,getMedicaTimeById}=require('../controllers/meditimesController')
const { body,param, validationResult } = require('express-validator');

router.use(protect);

router.get('/',protect,getNurses);
router.post('/', protect,authorize, (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },createNurse);
router.get('/:id', protect, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getNurseById);
router.delete('/:id',protect, authorize,deleteNurse);
router.get('/assignments',protect,getAssignments);
router.get('/assignments/:id', protect,param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getAssignmentById);
router.get('/medicatimes', protect,getAllMedicaTimes);
router.get('/medicatimes/:id',protect, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getMedicaTimeById);

module.exports = router;