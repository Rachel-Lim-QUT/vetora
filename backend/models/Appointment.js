const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patient: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    // Appointment lifecycle (FSM):
// Requested → Confirmed → InProgress → (Completed | Cancelled)
// Single source of truth = status  (legacy `completed` auto-syncs)
// Allowed transitions: 
//   Requested → Confirmed | Cancelled
//   Confirmed → InProgress | Cancelled
//   InProgress → Completed | Cancelled
    status: {
    type: String,
    enum: ['Requested','Confirmed','InProgress','Completed','Cancelled'],
    default: 'Requested'
  },
  statusHistory: [{
    from: String, to: String,
    at: { type: Date, default: Date.now },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String
  }],
  // legacy flag
  completed: { type: Boolean, default: false },
}, { timestamps: true });
// keep legacy flag in sync
appointmentSchema.pre('save', function(next) {
  if (this.isModified('completed')) {
    this.status = this.completed ? 'Completed' : (this.status === 'Completed' ? 'Confirmed' : this.status);
  }
  if (this.isModified('status')) this.completed = (this.status === 'Completed');
  next();
});


module.exports = mongoose.model('Appointment', appointmentSchema);