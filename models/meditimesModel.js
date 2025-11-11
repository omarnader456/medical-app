const mongoose = require('mongoose');

const mediTimesSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
    times: { type: [String], required: true }, 
    }, { timestamps: true });

    module.exports = mongoose.model('MediTimes', mediTimesSchema);