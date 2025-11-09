const express = require('express');
const { getAllUsers,
    deleteUser,
    updateUserRole,
    getUserById,
    createUser,
    updateUserEmail } = require('../controllers/adminController');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {    assignPatient,
    getAssignments,
    getAssignmentById,
    deleteAssignment} =require('../controllers/assignpatController');
router.use(protect);

router.get('/users', authorize(), getAllUsers);
router.get('/users/:id', authorize(), getUserById);
router.put('/users/:id/role', authorize(), updateUserRole);
router.put('/users/:id/email', authorize(), updateUserEmail);
router.delete('/users/:id', authorize(), deleteUser);
router.post('/assignments', authorize(), assignPatient);
router.get('/assignments', authorize(), getAssignments);
router.get('/assignments/:id', authorize(), getAssignmentById);
router.delete('/assignments/:id', authorize(), deleteAssignment);

module.exports = router;

