const User =require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const users = await User.find({}, 'username email role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, fields: 'username email role' }
        ); 
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
};

exports.getUserById = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const foundUser = await User.findById(req.params.id, 'username email role');
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(foundUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { username, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        User.create({ username, email, password, role });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserEmail = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { email },
            { new: true, fields: 'username email role' }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllUsers: exports.getAllUsers,
    deleteUser: exports.deleteUser,
    updateUserRole: exports.updateUserRole,
    getUserById: exports.getUserById,
    createUser: exports.createUser,
    updateUserEmail: exports.updateUserEmail
};


