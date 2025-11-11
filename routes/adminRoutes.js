const express = require('express');
const {    getAllUsers,
    deleteUser,
    updateUserRole,
    getUserById,
    createUser,
    updateUserEmail,
    updateUserName,
    updateUserPassword} = require('../controllers/adminController');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {    assignPatient,
    getAssignments,
    getAssignmentById,
    deleteAssignment} =require('../controllers/assignpatController');
const { body,param, validationResult } = require('express-validator');
router.use(protect);
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/;

router.get('/users', protect,authorize, getAllUsers);
router.get('/users/:id', protect,param('id').notEmpty().withMessage('require id in url').isMongoId().withMessage('invalid ID'),(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },getUserById);
router.put('/users/:id/role', protect,authorize, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },updateUserRole);
router.put('/users/:id/email',protect, (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },updateUserEmail);
router.put('/users/:id/name',protect, (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },updateUserName);
router.put('/users/:id/password',protect, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),
body('password').notEmpty().withMessage('empty passowrd').matches(passwordRegex).withMessage('Password must be at least 10 characters and contain: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character')
,(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },updateUserPassword);
router.post('/users',protect, authorize,(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },createUser);
router.delete('/users/:id',protect, authorize, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),deleteUser);
router.post('/assignments',protect, authorize, (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },assignPatient);
router.get('/assignments',protect,getAssignments);
router.get('/assignments/:id',protect, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),getAssignmentById);
router.delete('/assignments/:id', protect,authorize, param('id').notEmpty().withMessage('id is required').isMongoId().withMessage('invalid id'),deleteAssignment);

module.exports = router;

