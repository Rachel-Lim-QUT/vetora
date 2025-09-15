const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  fname:    { type: String, required: true },
  lname:    { type: String, required: true },
  clinic:   { type: String, required: true },
  role:     { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
  try {
    
    this.name = `${this.fname || ''} ${this.lname || ''}`.trim();

    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
