const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Nurse = require('../models/nurseModel');
const Patient = require('../models/patientModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');


exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}, 'name email role twoFactor');
    res.status(200).json(users);
});


exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id, 'name email role twoFactor');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


exports.createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, specialty, department, age, diagnoses } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password, role });

    if (user) {
        if (role === 'doctor') {
            await Doctor.create({ user: user._id, name, specialty: specialty || 'General' });
        } else if (role === 'nurse') {
            await Nurse.create({ user: user._id, name, department: department || 'General' });
        } else if (role === 'patient') {
            await Patient.create({ user: user._id, name, age: age || 0, diagnoses: diagnoses || 'None' });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


exports.updateUserName = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const { name } = req.body;

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    if (user.name === name) {
        return res.json({ status: 'already', message: 'Name is already the same' });
    }

    user.name = name;
    await user.save();
    
    if (user.role === 'doctor') {
        await Doctor.updateOne({ user: user._id }, { name });
    } else if (user.role === 'nurse') {
        await Nurse.updateOne({ user: user._id }, { name });
    } else if (user.role === 'patient') {
        await Patient.updateOne({ user: user._id }, { name });
    }

    res.json({ status: 'success', message: 'Name updated successfully', name: user.name });
});

exports.updateUserEmail = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const { email } = req.body;

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    if (user.email === email) {
        return res.json({ status: 'already', message: 'Email is already the same' });
    }

    user.email = email;
    await user.save();

    res.json({ status: 'success', message: 'Email updated successfully', email: user.email });
});

exports.updateUserPassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const { password } = req.body;

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    user.password = password;
    await user.save();

    res.json({ status: 'success', message: 'Password updated successfully' });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const { role } = req.body;
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.role === role) {
        return res.json({ status: 'already', message: 'Role is already the same' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    if (oldRole === 'doctor') await Doctor.deleteOne({ user: user._id });
    if (oldRole === 'nurse') await Nurse.deleteOne({ user: user._id });
    if (oldRole === 'patient') await Patient.deleteOne({ user: user._id });
    
    if (role === 'doctor') await Doctor.create({ user: user._id, name: user.name, specialty: 'New Specialty' });
    if (role === 'nurse') await Nurse.create({ user: user._id, name: user.name, department: 'New Department' });
    if (role === 'patient') await Patient.create({ user: user._id, name: user.name, age: 0 });

    res.json({ status: 'success', message: `Role updated to ${role}`, role: user.role });
});

exports.updateusr = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { name, email } = req.body;
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    let updated = false;

    if (name && name !== user.name) {
        user.name = name;
        updated = true;
    }
    
    if (email && email !== user.email) {
        user.email = email;
        updated = true;
    }
    
    if (!updated) {
        return res.json({ status: 'already', message: 'No changes detected' });
    }

    await user.save();

    if (user.role === 'doctor') await Doctor.updateOne({ user: user._id }, { name: user.name });
    if (user.role === 'nurse') await Nurse.updateOne({ user: user._id }, { name: user.name });
    if (user.role === 'patient') await Patient.updateOne({ user: user._id }, { name: user.name });

    res.json({ status: 'success', message: 'Profile updated successfully', name: user.name, email: user.email });
});

exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.role === 'doctor') await Doctor.deleteOne({ user: user._id });
    if (user.role === 'nurse') await Nurse.deleteOne({ user: user._id });
    if (user.role === 'patient') await Patient.deleteOne({ user: user._id });
    
    await user.deleteOne();

    res.json({ status: 'success', message: 'User removed' });
});