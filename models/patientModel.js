const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true },
    age: { type: Number, required:true },
    diagnoses: { type: String },
    medications: { type: [String] }
    }, { timestamps: true });

    module.exports = mongoose.model('Patient', patientSchema);

