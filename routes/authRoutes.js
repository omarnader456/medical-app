const express = require('express');
const { register, login, verify2fa, updateSelfPassword, updateSelfProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/;

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

router.post('/login', validate, login);
router.post('/2fa/verify', verify2fa);

router.post(
    '/register',
    protect,
    authorize, 
    [
        body('email').isEmail().withMessage('Valid email required'),
        body('password').matches(passwordRegex).withMessage('Password too weak'),
        body('role').isIn(['admin', 'doctor', 'nurse', 'patient']).withMessage('Invalid role'),
    ],
    validate,
    register
);

router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
    res.clearCookie('patientId', { httpOnly: true, sameSite: 'lax' }); 
    res.json({ message: 'Logged out' });
});

router.put(
    '/password',
    protect,
    body('password').matches(passwordRegex).withMessage('Password too weak'),
    validate,
    updateSelfPassword
);

router.put(
    '/profile',
    protect,
    [
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Valid email required'),
    ],
    validate,
    updateSelfProfile
);


module.exports = router;