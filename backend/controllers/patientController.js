const Patient = require('../models/Patient');

// Create Patient
const createPatient = async (req, res) => {
    const { fname, lname, dob, gender, phone, email } = req.body;
    try {
        const patient = await Patient.create({ userID: req.user.id, fname, lname, dob, gender, phone, email });
        res.status(201).json({
            fname: patient.fname,
            lname: patient.lname,
            dob: patient.dob,
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Patient
const getPatient = async (req, res) => {
    try {
        const patients = await Patient.find({ userID: req.user.id });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

module.exports = { createPatient, getPatient };