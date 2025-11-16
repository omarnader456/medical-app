const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const { send2faEmail } = require('../config/mailer');

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    

    res.status(201).json({ token });
});

async function send2FACodeToUser(user) {
  const code = Math.floor(100000 + Math.random()*900000).toString(); // 6-digit
  const codeHash = crypto.createHash('sha256').update(code).digest('hex');
  user.twoFactor.codeHash = codeHash;
  user.twoFactor.codeExpires = Date.now() + (10 * 60 * 1000); // 10 minutes
  await user.save();
  await send2faEmail(user.email, code);
} 

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });
    res.status(200).json({ token });
    await send2FACodeToUser(user); 
    return res.status(200).json({ requires2fa: true, message: "Enter code sent to  email" });
});


exports.verify2fa = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.twoFactor || !user.twoFactor.codeHash) {
    return res.status(400).json({ message: 'No pending 2FA' });
  }
  if (Date.now() > user.twoFactor.codeExpires) {
    return res.status(400).json({ message: 'Code expired' });
  }
  const codeHash = crypto.createHash('sha256').update(code).digest('hex');
  if (codeHash !== user.twoFactor.codeHash) {
    return res.status(401).json({ message: 'Invalid code' });
  }

  user.twoFactor.codeHash = undefined;
  user.twoFactor.codeExpires = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, { httpOnly:true, secure: process.env.NODE_ENV === 'production', sameSite:'lax' });
  res.json({ message: '2FA verified' });
});


module.exports = {
    register: exports.register,
    login: exports.login,
    verify2fa: exports.verify2fa
};
