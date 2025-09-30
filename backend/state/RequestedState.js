const BaseState = require('./BaseState');
class RequestedState extends BaseState {
  async confirm({ user, reason }){ this.ensureOwner(user); this.ensureTimeNotPassed(); return this.ctx.transitionTo('Confirmed',{user,reason}); }
  async cancel({ user, reason }){  this.ensureOwner(user); return this.ctx.transitionTo('Cancelled',{user,reason}); }
}
module.exports = RequestedState;
