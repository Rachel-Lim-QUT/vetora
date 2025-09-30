const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },

    // patient link
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
});

module.exports = mongoose.model('Appointment', appointmentSchema);