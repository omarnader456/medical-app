const express = require('express');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

const csrfProtection = csurf({ cookie: true });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100
});
app.use(limiter);

app.use((req, res, next) => {
  if (req.csrfToken) res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/nurse', require('./routes/nurseRoutes'));
app.use('/api/patient', require('./routes/patientRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
