const Appointment = require('../models/Appointment');
const { decorate, catchAsync } = require('../utils/decorators');
const { withLogging, requireRoles, withRateLimit, withAudit } = require('../utils/decoratorPresets');
const { transitionAppointment } = require('../appointment/appointmentStateService');
const { allowedTransitions } = require('../appointment/stateMachine');

// JENS DESIGN PATTERN IMPORTS
const AppointmentRepository = require('../repositories/AppointmentRepository');
const Logger = require('../services/logger');
const appointmentEmitter = require('../services/appointmentEvents');  // Gh DesignPattern eventBus


const createAppointmentCore = async (req, res) => {
    const { patient, type, date, completed } = req.body;
    if (!patient || !type || !date) {
        return res.status(400).json({ message: 'patient, type, and date are required' });
    }
    const appointment = await Appointment.create({
        userID: req.user.id,
        patient, type, date,
        status: 'Requested',
        completed: Boolean(completed),
    });

    Logger.log(`Appointment created for user ${req.user.id}`); // JENS DESIGN PATTERN

    return res.status(201).json({
        _id: appointment._id,
        patient: appointment.patient,
        type: appointment.type,
        date: appointment.date,
        status: appointment.status,
        completed: appointment.completed,
        allowedTransitions: allowedTransitions(appointment.status),
    });
};

// Create Appointment
const createAppointment = decorate(
    catchAsync(createAppointmentCore),
    withLogging('CreateAppointment'),

    requireRoles([]),
    withRateLimit({ limit: 30, windowMs: 60_000 }),
    withAudit('appointment.create', (req) => ({
        patient: req.body?.patient,
        type: req.body?.type,
        date: req.body?.date,
    }))
);


// Get Appointment
const getAppointment = async (req, res) => {
    try {
const appointments = await AppointmentRepository.getAppointments(req.user.id);

        Logger.log(`Fetched ${appointments.length} appointments for user ${req.user.id}`); // JENS DESIGN PATTERN --------------------------------------

        return res.json(
        appointments.map(a => ({
        _id: a._id,
        patient: a.patient,
        type: a.type,
        date: a.date,
        status: a.status || (a.completed ? 'Completed' : 'Requested'),
        completed: a.completed,
      }))
    );
    } catch (error) {
        Logger.error(`Error fetching appointments: ${error.message}`); // JENS DESIGN PATTERN --------------------------------------
        res.status(500).json({ message: error.message })
    }
};

  const getAppointmentById = async (req, res) => {
  const a = await Appointment.findOne({ _id: req.params.id, userID: req.user.id })
                             .populate('patient','name lname');
  if (!a) return res.status(404).json({ message: 'Not found' });
  res.json({
    _id: a._id, patient: a.patient, type: a.type, date: a.date,
    status: a.status, completed: a.completed,
    allowedTransitions: allowedTransitions(a.status),
  });
};



const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // If a lifecycle action is requested, run it via FSM and return.
    const action = req.body?.action; // 'confirm' | 'start' | 'complete' | 'cancel'
    if (action) {
    const result = await transitionAppointment({
                id,
                action,
                user: req.user,
                reason: req.body?.reason,
                eventBus: req.app?.locals?.eventBus
            });
            return res.json({ _id: id, ...result });
        }

        //  Normal field updates (no lifecycle change).
    const allowed = ['patient', 'type', 'date'];
    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

        // Block direct status/completed edits (must use `action` above)
        if ('status' in req.body || 'completed' in req.body) {
            return res.status(400).json({ message: 'Use action (confirm/start/complete/cancel) to change status' });
        }

        // Only owner can edit
        const updated = await Appointment.findOneAndUpdate(
            { _id: id, userID: req.user.id },
            updates,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Appointment not found or not permitted' });
        }

        // Return updated doc (consistent minimal shape)
        return res.json({
            _id: updated._id,
            patient: updated.patient,
            type: updated.type,
            date: updated.date,
            status: updated.status,
            completed: updated.completed,  // legacy mirror
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await AppointmentRepository.deleteAppointment(id, userId);

        Logger.log(`Appointment deleted: id ${id} by user ${userId}`); // JENS DESIGN PATTERN ---------------------------------------------------

        res.status(200).json(result);
    } catch (error) {
        Logger.error(`Error deleting appointment ${req.params.id}: ${error.message}`); // JENS DESIGN PATTERN ---------------------------------------------------
        res.status(500).json({ message: error.message });
    }
}

// complete appointment
const completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const updatedAppointment = await AppointmentRepository.updateAppointment(
            id,
            userId,
            { completed: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        Logger.log(`Appointment completed: id ${id} by user ${userId}`); // JENS DESIGN PATTERN ---------------------------------------------------

        appointmentEmitter.emit('appointmentCompleted', updatedAppointment);

        res.status(200).json(updatedAppointment);
    } catch (error) {
        Logger.error(`Error completing appointment ${req.params.id}: ${error.message}`); // JENS DESIGN PATTERN ---------------------------------------------------
        res.status(500).json({ message: error.message });
    }
};
// Generic transition handler
const transition = async (req, res) => {
  const { id } = req.params;
  const action = String(req.body?.action || '').toLowerCase(); 
  if (!action) return res.status(400).json({ message: 'action is required' });

  const result = await transitionAppointment({
    id,
    action,                 // like CONFIRM/START/COMPLETE/CANCEL
    user: req.user,
    reason: req.body?.reason,
    eventBus: req.app?.locals?.eventBus, 
  });

  return res.json({ _id: id, ...result });
};

module.exports = { createAppointment, getAppointment, getAppointmentById, updateAppointment, deleteAppointment, completeAppointment, transition };
