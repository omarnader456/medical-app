const express = require('express');
const { getAllUsers, deleteUser, updateUserRole, getUserById, createUser, updateUserEmail, updateUserName, updateUserPassword,updateUser} = require('../controllers/adminController');
const { assignPatient, getAssignments, getAssignmentById, deleteAssignment } = require('../controllers/assignpatController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { param, body, validationResult } = require('express-validator');

const router = express.Router();
router.use(protect);

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/;
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/users', authorize, getAllUsers);
router.post('/users', authorize, validate, createUser);
router.post('/assignments', authorize, validate, assignPatient);
router.get('/assignments', getAssignments);
router.get('/users/:id', [param('id').notEmpty().isMongoId()], validate, getUserById);
router.put('/users/:id/role', authorize, [param('id').notEmpty().isMongoId()], validate, updateUserRole);
router.put('/users/:id/email', validate, updateUserEmail);
router.put('/users/:id/name', validate, updateUserName);
router.put('/user/:id/update',protect,updateUser);
router.put(
  '/users/:id/password',
  [param('id').notEmpty().isMongoId(), body('password').matches(passwordRegex)],
  validate,
  updateUserPassword
);

router.delete('/users/:id', authorize, [param('id').notEmpty().isMongoId()], deleteUser);


router.get('/assignments/:id', [param('id').notEmpty().isMongoId()], validate, getAssignmentById);
router.delete('/assignments/:id', authorize, [param('id').notEmpty().isMongoId()], deleteAssignment);

module.exports = router;
