const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const { runTransition } = require('./stateMachine');

async function withSession(fn) {
  const session = await mongoose.startSession();
  try {
    let out;
    await session.withTransaction(async () => { out = await fn(session); });
    return out;
  } finally {
    session.endSession();
  }
}

async function transitionAppointment({ id, action, user, reason, eventBus }) {
  return withSession(async (session) => {
    const appt = await Appointment.findById(id).session(session);
    if (!appt) throw new Error('Appointment not found');

    // core FSM call
    const result = await runTransition(appt, action); // { status, allowedTransitions }
    await appt.save({ session }); // persist new status

    return {
      _id: appt._id,
      patient: appt.patient,
      type: appt.type,
      date: appt.date,
      status: result.status,
      allowedTransitions: result.allowedTransitions,
    };
  });
}

module.exports = { transitionAppointment };
