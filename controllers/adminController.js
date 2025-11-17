const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

exports.getAllUsers = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const users = await User.find({}, 'name email role');
    res.status(200).json(users);
});

exports.deleteUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, fields: 'name email role' }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
});

exports.getUserById = asyncHandler(async (req, res) => {
    const foundUser = await User.findById(req.params.id, 'name email role');
    if (!foundUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(foundUser);
});

exports.createUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const newUser = await User.create({ name, email, password, role });
    res.status(201).json({ message: 'User created successfully', user: newUser });
});

exports.updateUserEmail = asyncHandler(async (req, res) => {
    console.log('req.user:', req.user);
    console.log('req.params.id:', req.params.id);
    if (req.user._id.toString() !== req.params.id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
    }
    const { email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { email },
        { new: true, fields: 'name email role' }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
});

exports.updateUserName = asyncHandler(async (req, res) => {
    if (req.user.id !== req.params.id) return res.status(403).json({ message: 'Access denied' });

    const { name } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true, fields: 'name email role' }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
});

exports.updateUserPassword = asyncHandler(async (req, res) => {
    const updatedUser=req.user;
    const { password } = req.body;
    updatedUser.password = password;
    await updatedUser.save();
    res.status(200).json({ message: 'Password updated successfully' });
});

exports.updateUser = asyncHandler(async (req, res) => {

    const { id } = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ status: "error", message: 'user not found' });
    }
    const { name, email, role} = req.body;
    const updates = {};
    const changedFields = [];
    if (name !== undefined && name.trim() !== user.name) {
        updates.name = name.trim();
        changedFields.push("name");
    }
    if (email !== undefined && email.trim() !== user.email) {
        updates.email = email.trim();
        changedFields.push("email");
    }
    if (role !== undefined && role.trim() !== user.role) {
        updates.role = role.trim();
        changedFields.push("role");
    }
    if (changedFields.length === 0) {
        return res.status(200).json({
            status: "already",
            message: "No changes detected. Already updated.",
        });
    }
    const updt = await Medication.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    );

    return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        updated
    });
});
exports.updateusr=asyncHandler(async(req,res)=>{
    const user = await req.user;
    id=user._id;
    if (!user) {
        return res.status(404).json({ status: "error", message: 'user not found' });
    }
    const { name, email, role} = req.body;
    const updates = {};
    const changedFields = [];
    if (name !== undefined && name.trim() !== user.name) {
        updates.name = name.trim();
        changedFields.push("name");
    }
    if (email !== undefined && email.trim() !== user.email) {
        updates.email = email.trim();
        changedFields.push("email");
    }
    if (role !== undefined && role.trim() !== user.role) {
        updates.role = role.trim();
        changedFields.push("role");
    }
    if (changedFields.length === 0) {
        return res.status(200).json({
            status: "already",
            message: "No changes detected. Already updated.",
        });
    }
    const updt = await Medication.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    );

    return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        updated
    });
});

module.exports = {
    getAllUsers: exports.getAllUsers,
    deleteUser: exports.deleteUser,
    updateUserRole: exports.updateUserRole,
    getUserById: exports.getUserById,
    createUser: exports.createUser,
    updateUserEmail: exports.updateUserEmail,
    updateUserName: exports.updateUserName,
    updateUserPassword: exports.updateUserPassword,
    updateUser:exports.updateUser,
    updateusr:exports.updateusr
};
