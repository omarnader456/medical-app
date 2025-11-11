const mongoose = require('mongoose');

const mediTimesSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
    times: { type: [String], required: true }, // e.g., ["08:00", "12:00", "18:00"]
    }, { timestamps: true });

    module.exports = mongoose.model('MediTimes', mediTimesSchema);