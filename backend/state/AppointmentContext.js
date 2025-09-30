const RequestedState  = require('./RequestedState');
const ConfirmedState  = require('./ConfirmedState');
const InProgressState = require('./InProgressState');
const CompletedState  = require('./CompletedState');
const CancelledState  = require('./CancelledState');

const STATES = { Requested:RequestedState, Confirmed:ConfirmedState, InProgress:InProgressState, Completed:CompletedState, Cancelled:CancelledState };

class AppointmentContext {
  constructor({ appointment, uow, eventBus }){
    this.appointment = appointment;
    this.uow = uow; this.eventBus = eventBus;
    this._state = new (STATES[appointment.status])(this);
  }
  setStateByName(n){ this._state = new (STATES[n])(this); }

  confirm(a){  return this._state.confirm(a); }
  start(a){    return this._state.start(a); }
  complete(a){ return this._state.complete(a); }
  cancel(a){   return this._state.cancel(a); }

  async transitionTo(nextStatus, { user, reason }){
    const prev = this.appointment.status;
    if (prev===nextStatus) return this.appointment;

    const apply = async (session)=>{
      this.appointment.status = nextStatus;
      this.appointment.statusHistory.push({ from:prev, to:nextStatus, by:user?._id, reason });
      await this.appointment.save({ session });
      if (this.eventBus?.publish) await this.eventBus.publish('Appointment.StatusChanged',{ id:this.appointment._id, from:prev, to:nextStatus, by:user?._id, at:new Date() });
      this.setStateByName(nextStatus);
      return this.appointment;
    };
    if (this.uow?.withTxn) return this.uow.withTxn(apply);
    return apply();
  }
}
module.exports = AppointmentContext;
