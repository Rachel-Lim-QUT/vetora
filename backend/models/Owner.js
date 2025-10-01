// owner
const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: false },

    // linking patient and owner
    // patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
});

module.exports = mongoose.model('Owner', ownerSchema);