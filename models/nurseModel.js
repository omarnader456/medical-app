const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true },
    department: { type: String, required:true },
    assignedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
    }, { timestamps: true });

    module.exports = mongoose.model('Nurse', nurseSchema);
    