const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const { connectDB } = require('./config/db');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to DB
connectDB();

// Security middlewares
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());

// CSRF and rate limit setup
const csrfProtection = csurf({ cookie: true });
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});
app.use(limiter);
app.use(csrfProtection);

// Add CSRF token to cookies
app.use((req, res, next) => {
    if (req.csrfToken) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
    }
    next();
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/nurse', require('./routes/nurseRoutes'));
app.use('/api/patient', require('./routes/patientRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
module.exports = app;
