const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fname:      { type: String, required: true, trim: true },
    lname:      { type: String, required: true, trim: true },
    clinic:     { type: String, required: true, trim: true },
    role:       { type: String, required: true },
    username:   { type: String, required: true, unique: true, trim: true },
    password:   { type: String, required: true },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);