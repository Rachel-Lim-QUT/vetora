const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    status: { type: String, required: true }, // Rachel's note: For example, Upcoming, In Progress, Complete, etc.
    date: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
});

module.exports = mongoose.model('Appointment', appointmentSchema);