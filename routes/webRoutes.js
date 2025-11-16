const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const MedicaTimes =require('../models/meditimesModel');
const Medication =require('../models/medicationModel');

router.get('/login', (req, res) => res.render('login'));

router.get('/2fa', (req, res) => res.render('2fa'));

router.get('/dashboard', protect, (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

const { doctorsOnly } = require('../middleware/roleMiddleware');
const Assignpat = require('../models/assignpatModel');

router.get('/select-patient', protect, doctorsOnly, async (req, res) => {
    const assignments = await Assignpat.find({ assigneddoc: req.user._id }).populate('patient', 'name _id');
    res.render('doctor/selectPatient', { assignments, csrfToken: req.csrfToken() });
});

router.post('/set-patient', protect, doctorsOnly, async (req, res) => {
    const { patientId } = req.body;

    const assignment = await Assignpat.findOne({ patient: patientId, assigneddoc: req.user._id });
    if (!assignment) return res.status(403).json({ message: 'Access denied' });

    res.cookie('patientId', patientId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    res.json({ message: 'Patient selected' });
});

router.get('/dashboard', protect, doctorsOnly, async (req, res) => {
    const patientId = req.cookies.patientId;
    if (!patientId) return res.redirect('/select-patient');
    const patient = await Patient.findById(patientId, 'name age diagnoses');
    res.render('doctor/dashboard', {
        patient,       
        csrfToken: req.csrfToken()
    });
});


router.get('/patient/medications', protect, doctorsOnly, async (req, res) => {
    const patientId = req.cookies.patientId;
    if (!patientId) return res.redirect('/select-patient');

    const medications = await Medication.find({ patient: patientId }).populate('name', 'description','sideEffects','dosage');

    res.render('doctor/medications', { medications, csrfToken: req.csrfToken() });
});

router.get('/patient/medTimes', protect, doctorsOnly, async (req, res) => {
    const patientId = req.cookies.patientId;
    if (!patientId) return res.redirect('/select-patient');

    const medTimes = await MedicaTimes.find({ patient: patientId }).populate('medication', 'times');

    res.render('doctor/medTimes', { medTimes, csrfToken: req.csrfToken() });
});


router.get('/doctor/medications', protect, async (req, res) => {
    const response = await fetch(`${process.env.BASE_URL}/api/doctor/medications`, {
        headers: { Cookie: `token=${req.cookies.token}` }
    });

    const medications = await response.json();

    res.render('medications', { medications, csrfToken: req.csrfToken() });
});

router.get('/admin/users', protect, async (req, res) => {
    const response = await fetch(`${process.env.BASE_URL}/api/admin/users`, {
        headers: { Cookie: `token=${req.cookies.token}` }
    });

    const users = await response.json();

    res.render('admin/users', { users, csrfToken: req.csrfToken() });
});

router.get('/admin/selectuser/:id', protect, async (req, res) => {
    const userId = req.params.id;

    const response = await fetch(
        `${process.env.BASE_URL}/api/admin/users/${userId}`,
        { headers: { Cookie: `token=${req.cookies.token}` } }
    );

    const user = await response.json();

    if (!user || user.message === "User not found") {
        return res.redirect('/admin/users');
    }

    res.render('admin/selectUser', { 
        user,
        csrfToken: req.csrfToken() 
    });
});

router.delete('/api/admin/users/:id', protect, deleteUser);

router.get('/doctor/assignments', protect, async (req, res) => {
    const response = await fetch(`${process.env.BASE_URL}/api/doctor/assignments`, {
        headers: { Cookie: `token=${req.cookies.token}` }
    });

    const assignments = await response.json();

    res.render('doctor/assignments', { assignments, csrfToken: req.csrfToken() });
});

router.get('/doctor/medicatimes/:id', protect, (req, res) => {
    res.render('doctor/createMedTime', { 
        assignmentId: req.params.id,
        csrfToken: req.csrfToken()
    });
});



module.exports = router;