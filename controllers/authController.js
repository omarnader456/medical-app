const asyncHandler = require('express-async-handler');
const speakeasy = require('speakeasy');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { send2faEmail } = require('../config/mailer');

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body; 
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password, role });

    if (user) {
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

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (user.twoFactor.enabled) {
            const secret = speakeasy.generateSecret({ length: 20 }).base32;
            const code = speakeasy.totp({ secret, encoding: 'base32' });

            const salt = await bcrypt.genSalt(10);
            user.twoFactor.codeHash = await bcrypt.hash(code.toString(), salt);
            user.twoFactor.codeExpires = new Date(Date.now() + 10 * 60 * 1000); 

            await user.save();
            await send2faEmail(user.email, code);

            return res.json({ requires2fa: true, message: '2FA code sent to email.' });
        }

        generateToken(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

exports.verify2fa = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    if (!code) {
        res.status(400);
        throw new Error('2FA code is required.');
    }

    const user = await User.findOne({ email: req.body.email }); 
    
    if (!user || !user.twoFactor.enabled || !user.twoFactor.codeHash) {
        res.status(401);
        throw new Error('2FA verification failed or user not found.');
    }

    const isMatch = await bcrypt.compare(code, user.twoFactor.codeHash);
    const isExpired = user.twoFactor.codeExpires < new Date();

    if (isMatch && !isExpired) {
        user.twoFactor.codeHash = undefined;
        user.twoFactor.codeExpires = undefined;
        await user.save();

        generateToken(res, user._id);
        
        return res.json({ message: 'Login successful' });
    }

    res.status(401);
    throw new Error('Invalid or expired 2FA code.');
});

exports.updateSelfPassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { password } = req.body;

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.password = password;
    await user.save();

    res.json({ status: 'success', message: 'Password updated successfully' });
});

exports.updateSelfProfile = asyncHandler(async (req, res) => {
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

    res.json({ status: 'success', message: 'Profile updated successfully', name: user.name, email: user.email });
});