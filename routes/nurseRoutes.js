const express = require('express');
const { getNurses, getNurseById, createNurse, updateNurse, deleteNurse } = require('../controllers/nurseController');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', authorize(), getNurses);
router.post('/', authorize(), createNurse);
router.get('/:id', authorize(), getNurseById);
router.delete('/:id', authorize(), deleteNurse);

module.exports = router;