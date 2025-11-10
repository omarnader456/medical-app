const User =require('../models/userModel');
const { updateUserPassword } = require('./userController');
const asyncHandler = require('express-async-handler');

exports.getAllUsers = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const users = await User.find({}, 'name email role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const name = req.body.name;
        const id =await User.findOne({name:name}).select('_id');
        if (!id){
            return res.status(404).json({ message: 'user not found' });
        }
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.updateUserRole = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { role } = req.body;
        const name =req.body.name;
        const id =await  User.findOne({name:name}).select('_id');
        if (!id){
            return res.status(404).json({message: 'User not found'});
        }
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, fields: 'name email role' }
        ); 
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
});

exports.getUserById = asyncHandler(async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.id, 'name email role');
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(foundUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.createUser = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        User.create({ name, email, password, role });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.updateUserEmail = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { email },
            { new: true, fields: 'name email role' }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUserName = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { name } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, fields: 'name email role' }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUserPassword = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        if (user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { password } = req.body;
        const updatedUser = await User.findById(req.params.id);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        updatedUser.password = password;
        await updatedUser.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = {
    getAllUsers: exports.getAllUsers,
    deleteUser: exports.deleteUser,
    updateUserRole: exports.updateUserRole,
    getUserById: exports.getUserById,
    createUser: exports.createUser,
    updateUserEmail: exports.updateUserEmail,
    updateUserName: exports.updateUserName,
    updateUserPassword:exports.updateUserPassword
};


