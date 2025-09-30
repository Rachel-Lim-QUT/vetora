const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const AppointmentContext = require('../state/AppointmentContext');

async function withSession(fn){
  const session = await mongoose.startSession();
  let res;
  await session.withTransaction(async()=>{ res = await fn(session); });
  session.endSession();
  return res;
}

async function runTransition({ id, action, user, reason, eventBus }){
  return withSession(async (session)=>{
    const appt = await Appointment.findById(id).session(session);
    if (!appt) throw new Error('Appointment not found');
    const ctx = new AppointmentContext({ appointment: appt, uow:{ withTxn:f=>f(session) }, eventBus });
    switch(action){
      case 'confirm':  return ctx.confirm({ user, reason });
      case 'start':    return ctx.start({ user, reason });
      case 'complete': return ctx.complete({ user, reason });
      case 'cancel':   return ctx.cancel({ user, reason });
      default: throw new Error('Unknown action');
    }
  });
}

module.exports = { runTransition };
