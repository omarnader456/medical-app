const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true },
    specialty: { type: String, required:true },
    }, { timestamps: true });

    module.exports = mongoose.model('Doctor', doctorSchema);