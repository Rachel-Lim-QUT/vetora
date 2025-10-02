const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const { runTransition, ACTIONS } = require('./stateMachine');

const MAP = { confirm: ACTIONS.CONFIRM, start: ACTIONS.START, complete: ACTIONS.COMPLETE, cancel: ACTIONS.CANCEL };

async function withSession(fn) {
  const session = await mongoose.startSession();
  try {
    let out;
    await session.withTransaction(async () => { out = await fn(session); });
    return out;
  } finally { session.endSession(); }
}

async function transitionAppointment({ id, action, user, reason, eventBus }) {
  const normalized = MAP[action] || action; // accept lowercase from UI

  return withSession(async (session) => {
    const appt = await Appointment.findById(id).session(session);
    if (!appt) throw new Error('Appointment not found');

    // core FSM call
    const result = await runTransition(appt, normalized); // { status, allowedTransitions }
    await appt.save({ session });
    
    if (eventBus) {
      await eventBus.publish('appointment.stateChanged', {
        id: appt._id.toString(),
        by: user?.id || user?._id?.toString?.() || null,
        action: normalized,
        reason: reason || null,
        newStatus: result.status,
        at: new Date().toISOString(),
      });
    }

    await appt.save({ session }); // persist new status
    return result;
  });
}

module.exports = { transitionAppointment };
