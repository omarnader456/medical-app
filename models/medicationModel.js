const mongoose = require('mongoose');

const mediShcema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    sideEffects: { type: [String] },
    dosage: { type: String, required: true },
    }, { timestamps: true });

    module.exports = mongoose.model('Medication', mediShcema);