const express = require('express');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json()); 

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests, try again later" }
});
app.use(limiter);

app.use(async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.locals.user = null;
            return next();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            res.clearCookie('token'); 
        }
        
        res.locals.user = user || null;
        req.user = user; 
        next();
    } catch (error) {
        res.clearCookie('token'); 
        res.locals.user = null;
        next();
    }
});

const csrfProtection = csurf({ 
    cookie: true,
   
});

app.use(csrfProtection, (req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); 
    res.cookie('XSRF-TOKEN', req.csrfToken(), { 
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    next();
});

const viewMiddleware = require('./middleware/viewMiddleware');
app.use(viewMiddleware);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/webRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/nurse', require('./routes/nurseRoutes'));
app.use('/api/patient', require('./routes/patientRoutes'));

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler); 

app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;