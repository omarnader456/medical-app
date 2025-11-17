const express = require('express');
const { 
    getAllUsers, deleteUser, updateUserRole, getUserById, createUser, updateUserName, updateUserEmail, updateUserPassword, updateusr
} = require('../controllers/adminController');
const { assignPatient, getAssignments, getAssignmentById, deleteAssignment } = require('../controllers/assignpatController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { param, body, validationResult } = require('express-validator');

const router = express.Router();

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/;
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

router.use(protect, authorize); 

router.get('/users', getAllUsers);
router.post(
    '/users', 
    [
        body('email').isEmail().withMessage('Valid email required'),
        body('password').matches(passwordRegex).withMessage('Password too weak'),
        body('role').isIn(['admin', 'doctor', 'nurse', 'patient']).withMessage('Invalid role'),
    ],
    validate, 
    createUser
);

router.put('/users/update', protect, updateusr);

router.post(
    '/assignments', 
    [
        body('patientId').isMongoId(), 
        body('assigneddocId').isMongoId(), 
        body('assignednurseId').isMongoId()
    ], 
    validate, 
    assignPatient
);
router.get('/assignments', getAssignments);

router.get('/users/:id', [param('id').isMongoId()], validate, getUserById);

router.put('/users/:id/role', [param('id').isMongoId()], validate, updateUserRole);
router.put(
    '/users/:id/email', 
    [param('id').isMongoId(), body('email').isEmail()], 
    validate, 
    updateUserEmail
);
router.put(
    '/users/:id/name', 
    [param('id').isMongoId(), body('name').notEmpty()], 
    validate, 
    updateUserName
);
router.put(
    '/users/:id/password', 
    [param('id').isMongoId(), body('password').matches(passwordRegex)],
    validate,
    updateUserPassword
);

router.delete('/users/:id', [param('id').isMongoId()], deleteUser);

router.get('/assignments/:id', [param('id').isMongoId()], validate, getAssignmentById);
router.delete('/assignments/:id', [param('id').isMongoId()], deleteAssignment);

module.exports = router;