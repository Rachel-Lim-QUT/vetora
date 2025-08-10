const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String },
    phone: { type: String },
    email: { type: String },
});

module.exports = mongoose.model('Patient', patientSchema);