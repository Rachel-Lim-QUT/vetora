const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patient: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Appointment', appointmentSchema);