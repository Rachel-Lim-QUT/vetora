const BaseState = require('./BaseState');
class ConfirmedState extends BaseState {
  async start({ user, reason }){ this.ensureOwner(user); if (new Date()<this.ctx.appointment.date) throw new Error('Too early to start'); return this.ctx.transitionTo('InProgress',{user,reason}); }
  async cancel({ user, reason }){ this.ensureOwner(user); return this.ctx.transitionTo('Cancelled',{user,reason}); }
}
module.exports = ConfirmedState;
