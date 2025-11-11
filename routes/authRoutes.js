const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { body,param, validationResult } = require('express-validator');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/;
router.post('/register',protect, authorize,
body('password').notEmpty().withMessage('empty password').matches(passwordRegex).withMessage('Password must be at least 10 characters and contain: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character') ,
(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },register);
router.post('/login', (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },login);


module.exports = router;
