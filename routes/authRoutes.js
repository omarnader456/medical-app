const express = require('express');
const { register, login } = require('../controllers/authController');
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

router.post(
  '/register',
  protect,
  authorize,
  body('password').matches(passwordRegex),
  validate,
  register
);

module.exports = router;
