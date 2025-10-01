const Appointment = require('../models/Appointment');
const { decorate, catchAsync } = require('../utils/decorators');
const { withLogging, requireRoles, withRateLimit, withAudit } = require('../utils/decoratorPresets');
const { runTransition } = require('../appointment/appointmentStateService');

// JENS DESIGN PATTERN IMPORTS
const AppointmentRepository = require('../repositories/AppointmentRepository');
const Logger = require('../services/logger');
const appointmentEmitter = require('../services/appointmentEvents');

/**
 * Create Appointment (Core)
 * ----------------------------------------------------------------------------
 * Business-only logic for creating an appointment.
 * Assumes `req.user` is already populated by the `protect` middleware.
 *
 * INPUT (req.body):
 *  - patient   {String}  : required
 *  - type      {String}  : required (e.g., "Checkup", "Vaccination", ...)
 *  - date      {String}  : required ISO datetime (will be cast to Date by Mongoose)
 *  - completed {Boolean} : optional (defaults to false if not provided)
 *
 * FLOW:
 *  1) Quick validation → if any of (patient, type, date) missing → 400 Bad Request.
 *  2) Create document with ownership binding: userID = req.user.id.
 *  3) Return minimal safe response payload (no internal fields) with 201 Created.
 *
 * OUTPUT (201):
 *  {
 *    _id, patient, type, date, completed
 *  }
 *
 * NOTES:
 *  - No try/catch here by design. Errors bubble up and are handled by
 *    the decorator `catchAsync` + global error handler.
 *  - Additional cross-field validation (e.g., future date) can be added
 *    either here or via a validation decorator/schema.
 */

const createAppointmentCore = async (req, res) => {
    const { patient, type, date, completed } = req.body;
    if (!patient || !type || !date) {
        return res.status(400).json({ message: 'patient, type, and date are required' });
    }
    const appointment = await Appointment.create({
        userID: req.user.id,
        patient, type, date,
        completed: Boolean(completed),
    });

    Logger.log(`Fetched ${appointments.length} appointments for user ${req.user.id}`); // JENS DESIGN PATTERN

    return res.status(201).json({
        _id: appointment._id,
        patient: appointment.patient,
        type: appointment.type,
        date: appointment.date,
        completed: appointment.completed,
    });

    Logger.error(`Error fetching appointments: ${error.message}`); // JENS DESIGN PATTERN - TRY TO KEEP THIS - IF YOU HAVE CATCH ERROR PLEASE PUT THIS WITH THAT (BEFORE)----------------
    // SEE JENS EXAMPLE OF WHERE THIS LOGGER GETS PLACED BELOW IN THE GET APPOINTMENT, SEE IF YOU CAN PUT THIS SOMEWHERE IN YOUR DESIGN PATTERN ---------------------------------------
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

        res.json(appointments);
    } catch (error) {
        Logger.error(`Error fetching appointments: ${error.message}`); // JENS DESIGN PATTERN --------------------------------------
        res.status(500).json({ message: error.message })
    }
};

// Update Appointment
// This update endpoint keeps your CREATE decorators intact.
// - If body contains `action` (confirm/start/complete/cancel) → use FSM (State Pattern).
// - Otherwise, allow normal field edits (patient/type/date).
// - Direct status/completed edits are blocked to avoid bypassing FSM.
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // 1) If a lifecycle action is requested, run it via FSM and return.
        const action = req.body?.action; // 'confirm' | 'start' | 'complete' | 'cancel'
        if (action) {
            const updated = await runTransition({
                id,
                action,
                user: req.user,
                reason: req.body?.reason,
                eventBus: req.app.get?.('eventBus')
            });
            return res.json(updated);
            // try {
            //     const { id } = req.params;
            //     const userId = req.user.id;
            //     const allowed = ['patient', 'type', 'date', 'completed'];
            //     const updates = {};
            //     for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

            //     // Ghazal's note: Just owner can edit
            //     const updatedAppointment = await AppointmentRepository.updateAppointment(id, userId, updates);

            //     Logger.log(`Appointment updated: id ${id} by user ${userId}`); // JENS DESIGN PATTERN - TRY TO INCLUDE THIS SOMEWHERE IN YOUR CODE ------------------------------

            //     res.status(200).json(updatedAppointment);

            // } catch (error) {
            //     Logger.error(`Error updating appointment ${req.params.id}: ${error.message}`); // JENS DESIGN PATTERN - TRY TO INCLUDE THIS SOMEWHERE IN YOUR CODE ----------------
            //     res.status(500).json({ message: error.message });
        }

        // 2) Normal field updates (no lifecycle change).
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


module.exports = { createAppointment, getAppointment, updateAppointment };

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

module.exports = { createAppointment, getAppointment, updateAppointment, deleteAppointment, completeAppointment };
