const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String },
    phone: { type: String },
    email: { type: String },
});

module.exports = mongoose.model('Patient', userSchema);