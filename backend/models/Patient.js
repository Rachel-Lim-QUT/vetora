const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    userID:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photo:      { type: String },
    name:       { type: String, required: true },
    age:        { type: String, required: true },
    gender:     { type: String, required: true },
    species:    { type: String, required: true },
    breed:      { type: String, required: true },
    color:      { type: String, required: true },
    history:    { type: String },

    // Owner Details
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
});

module.exports = mongoose.model('Patient', patientSchema);