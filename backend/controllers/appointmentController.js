const Appointment = require('../models/Appointment');

// Create Appointment
const createAppointment = async (req, res) => {
    const { patient, type, date, completed } = req.body;

    try {
        const appointment = await Appointment.create({
            userID: req.user.id,
            patient,
            type,
            date,
            completed,
        });

        res.status(201).json({
            patient: appointment.patient,
            type: appointment.type,
            date: appointment.date,
            completed: appointment.completed,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Appointment
const getAppointment = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userID: req.user.id });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

module.exports = { createAppointment, getAppointment };