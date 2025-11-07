const mongoose = require('mongoose');

const assignpatSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    assigneddoc: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    assignednurse: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse', required: true },
    }, { timestamps: true });

    module.exports = mongoose.model('Assignpat', assignpatSchema);