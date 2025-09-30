class BaseState {
  constructor(ctx){ this.ctx = ctx; }
  name(){ return this.constructor.name.replace('State',''); }
  async confirm(){  throw new Error(`Transition not allowed from ${this.name()} -> Confirmed`); }
  async start(){    throw new Error(`Transition not allowed from ${this.name()} -> InProgress`); }
  async complete(){ throw new Error(`Transition not allowed from ${this.name()} -> Completed`); }
  async cancel(){   throw new Error(`Transition not allowed from ${this.name()} -> Cancelled`); }
  ensureOwner(user){
    const same=(a,b)=>String(a)===String(b);
    if (!user || !this.ctx.appointment?.userID) throw new Error('Not authorized');
    if (!same(user._id, this.ctx.appointment.userID)) throw new Error('Not authorized');
  }
  ensureTimeNotPassed(){
    if (new Date() > this.ctx.appointment.date) throw new Error('Cannot change a past appointment');
  }
}
module.exports = BaseState;
