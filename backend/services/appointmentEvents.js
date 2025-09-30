const EventEmitter = require('events');
class AppointmentEmitter extends EventEmitter { }

const appointmentEmitter = new AppointmentEmitter();
module.exports = appointmentEmitter;