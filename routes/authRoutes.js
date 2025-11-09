const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');


router.post('/register',protect, authorize(), register);
router.post('/login', login);


module.exports = router;
