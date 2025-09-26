import Appointment from '../models/Appointment';

// Create Appointment
const createAppointment = async (req, res) => {
    const { patient, status, date, time, type, duration } = req.body;

    try {
        const appointment = await Appointment.create({
            userID: req.user.id,
            patient,
            status,
            date,
            time,
            type,
            duration
        });

        res.status(201).json({
            patient: appointment.patient,
            status: appointment.status,
            date: appointment.date,
            time: appointment.time,
            type: appointment.type,
            duration: appointment.duration,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createAppointment };