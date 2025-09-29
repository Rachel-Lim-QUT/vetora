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

// Update Appointment
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const allowed = ['patient', 'type', 'date', 'completed'];
        const updates = {};
        for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

        // Ghazal's note: Just owner can edit
        const updated = await Appointment.findOneAndUpdate(
            { _id: id, userID: req.user.id }, updates, { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: 'Appointment not found or not permitted' });

        res.json({
            _id: updated._id,
            patient: updated.patient,
            type: updated.type,
            date: updated.date,
            completed: updated.completed,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Error 404: Appointment not found.' });
        await appointment.remove();
        res.json({ message: 'Appointment canceled.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createAppointment, getAppointment, updateAppointment, deleteAppointment };
