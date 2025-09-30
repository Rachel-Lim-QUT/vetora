const appointmentEmitter = require('./appointmentEvents');
const Logger = require('./logger');

// observer: follow-up reminder
appointmentEmitter.on('appointmentCompleted', (appointment) => {
    Logger.log(`Follow-up reminder: Appointment ${appointment._id} for patient ${appointment.patient} is completed.`);
});