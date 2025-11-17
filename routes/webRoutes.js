const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { doctorsOnly, nurseOnly, adminOnly } = require('../middleware/roleMiddleware'); 
const MedicaTimes = require('../models/meditimesModel');
const Medication = require('../models/medicationModel');
const Assignpat = require('../models/assignpatModel');
const Patient = require('../models/patientModel'); 
router.get('/login', (req, res) => res.render('login'));
router.get('/2fa', (req, res) => res.render('2fa'));

router.get('/dashboard', protect, (req, res) => {
    if (!req.user) return res.redirect('/login');
    if (req.user.role === 'admin') return res.redirect('/admin/dashboard');
    if (req.user.role === 'doctor') return res.redirect('/doctor/select-patient');
    if (req.user.role === 'nurse') return res.redirect('/nurse/select-patient');
    if (req.user.role === 'patient') return res.redirect('/patient/dashboard');
    res.render('dashboard', { title: 'Dashboard', user: req.user });
});


router.get('/doctor/select-patient', protect, doctorsOnly, async (req, res) => {
    const assignments = await Assignpat.find({ assigneddoc: req.user._id }).populate('patient', 'name _id');
    res.render('doctors/selectPatient', { assignments });
});

router.post('/set-patient', protect, doctorsOnly, async (req, res) => {
    const { patientId } = req.body;

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(403).json({ message: 'Doctor profile not found.' });

    const assignment = await Assignpat.findOne({ patient: patientId, assigneddoc: doctor._id });
    if (!assignment) return res.status(403).json({ message: 'Access denied: Patient not assigned.' });

    res.cookie('patientId', patientId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    res.json({ message: 'Patient selected' });
});

router.get('/doctor/dashboard', protect, doctorsOnly, async (req, res) => {
    const patientId = req.cookies.patientId;
    if (!patientId) return res.redirect('/doctor/select-patient');

    const patient = await Patient.findById(patientId, 'name age diagnoses');
    if (!patient) return res.redirect('/doctor/select-patient');
    
    res.render('doctors/dashboard', {
        patient,
    });
});

router.get('/doctor/patient/medications', protect, doctorsOnly, async (req, res) => {
    const patientId = req.cookies.patientId;
    if (!patientId) return res.redirect('/doctor/select-patient');

    const medTimes = await MedicaTimes.find({ patient: patientId }).populate('medication');
    const medications = medTimes.map(mt => mt.medication).filter(med => med); 

    res.render('doctors/medications', { medications });
});

router.get('/doctor/updatemedications/:id', protect, doctorsOnly, async (req, res) => {
    const id = req.params.id;
    const token = req.cookies.token;

    const response = await fetch(`${process.env.BASE_URL}/api/doctor/medications/${id}`, {
        headers: { Cookie: `token=${token}` }
    });

    const medication = await response.json();

    if (!response.ok || medication.message) {
        return res.status(response.status).render('error', { message: medication.message || 'Medication not found' });
    }

    res.render('doctors/updatemedications', { medication });
});

router.get('/doctor/patient/medTimes', protect, doctorsOnly, async (req, res) => {
    const patientId = req.cookies.patientId;
    if (!patientId) return res.redirect('/doctor/select-patient');

    const medTimes = await MedicaTimes.find({ patient: patientId }).populate('medication', 'name times');

    res.render('doctors/medTimes', { medTimes });
});

router.get('/doctor/medicatimes/:assignmentId', protect, doctorsOnly, async (req, res) => {
    const assignmentId = req.params.assignmentId;
    
    const medications = await Medication.find({}, 'name _id');
    
    res.render('doctors/createMedTime', { 
        assignmentId,
        medications 
    });
});

router.get('/doctor/assignments', protect, doctorsOnly, async (req, res) => {
    const response = await fetch(`${process.env.BASE_URL}/api/doctor/assignments`, {
        headers: { Cookie: `token=${req.cookies.token}` }
    });

    const assignments = await response.json();

    res.render('doctors/assignments', { assignments });
});



router.get('/nurse/select-patient', protect, nurseOnly, async (req, res) => {
    const assignments = await Assignpat.find({ assignednurse: req.user._id }).populate('patient', 'name _id');
    res.render('nurses/selectPatient', { assignments });
});

router.get('/nurse/dashboard', protect, nurseOnly, (req, res) => {
    res.render('nurses/dashboard', { user: req.user });
});

router.get('/nurse/assignments', protect, nurseOnly, async (req, res) => {
    const response = await fetch(`${process.env.BASE_URL}/api/nurse/assignment`, {
        headers: { Cookie: `token=${req.cookies.token}` }
    });
    const assignments = await response.json();
    res.render('nurses/assignments', { assignments, userId: req.user._id });
});

router.get('/nurse/medications', protect, nurseOnly, async (req, res) => {
    const response = await fetch(`${process.env.BASE_URL}/api/doctor/medications`, {
        headers: { Cookie: `token=${req.cookies.token}` }
    });

    const medications = await response.json();

    res.render('nurses/medications', { medications });
});

router.get('/nurse/medTimes', protect, nurseOnly, async (req, res) => {
    const patientId = req.cookies.patientId;
    if (!patientId) return res.redirect('/nurse/select-patient');

    const medTimes = await MedicaTimes.find({ patient: patientId }).populate('medication', 'name times');

    res.render('nurses/medTimes', { medTimes });
});



router.get('/patient/dashboard', protect, async (req, res) => {
    res.render('patients/dashboard', { user: req.user });
});

router.get('/patient/assignment', protect, async (req, res) => {
    const response = await fetch(`${process.env.BASE_URL}/api/patient/assignment`, {
        headers: { Cookie: `token=${req.cookies.token}` }
    });
    const assignments = await response.json();
    res.render('patients/assignment', {
        assignments,
        userId: req.user._id
    });
});

router.get('/patient/medicationtimes', protect, async (req, res) => {
    const patientProfile = await Patient.findOne({ user: req.user._id });
    if (!patientProfile) return res.status(404).json({ message: 'Patient profile not linked.' });

    const medTimes = await MedicaTimes.find({ patient: patientProfile._id }).populate('medication', 'name');

    res.render('patients/medicationtimes', { medTimes });
});


router.get('/admin/dashboard', protect, authorize, (req, res) => {
    res.render('admins/dashboard');
});

router.get('/admin/createmedication', protect, doctorsOnly, (req, res) => { 
    res.render('admins/createmedication');
});

router.get('/admin/users', protect, authorize, async (req, res) => {
    const response = await fetch(`${process.env.BASE_URL}/api/admin/users`, {
        headers: { Cookie: `token=${req.cookies.token}` }
    });

    const users = await response.json();
    res.render('admins/users', { users });
});

router.get('/admin/selectuser/:id', protect, authorize, async (req, res) => {
    const userId = req.params.id;

    const response = await fetch(
        `${process.env.BASE_URL}/api/admin/users/${userId}`,
        { headers: { Cookie: `token=${req.cookies.token}` } }
    );

    const user = await response.json();

    if (!user || user.message) {
        return res.redirect('/admin/users');
    }

    res.render('admins/selectuser', { user });
});

router.get('/admin/user/:id/edit', protect, authorize, async (req, res) => {
    const userId = req.params.id;

    const response = await fetch(
        `${process.env.BASE_URL}/api/admin/users/${userId}`,
        { headers: { Cookie: `token=${req.cookies.token}` } }
    );
    const user = await response.json();

    if (!response.ok || user.message) {
        return res.redirect('/admin/users');
    }

    res.render('admins/manageuser', { user });
});


router.get('/user/updateaccount', protect, async (req, res) => {
    res.render('users/updateaccount', { user: req.user });
});

module.exports = router;