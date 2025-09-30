const AppointmentRepository = require('../repositories/AppointmentRepository');

// Create Appointment
const createAppointment = async (req, res) => {
    const { patient: patientId, type, date, completed } = req.body;

    try {
        const appointment = await AppointmentRepository.createAppointment({
            userID: req.user.id,
            patient: patientId,
            type,
            date,
            completed,
        });

        res.status(201).json({
            _id: appointment._id,
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
        const appointments = await AppointmentRepository.getAppointments(req.user.id);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// Update Appointment
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const allowed = ['patient', 'type', 'date', 'completed'];
        const updates = {};
        for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

        // Ghazal's note: Just owner can edit
        const updatedAppointment = await AppointmentRepository.updateAppointment(id, userId, updates);
        res.status(200).json(updatedAppointment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await AppointmentRepository.deleteAppointment(id, userId);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createAppointment, getAppointment, updateAppointment, deleteAppointment };
