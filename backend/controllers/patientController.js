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

// Update Patient
const updatePatient = async (req, res) => {
    const { fname, lname, dob, gender, phone, email } = req.body;
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Error 404: Patient not found.' });
        
        patient.fname = fname || patient.fname;
        patient.lname = lname || patient.lname;
        patient.dob = dob || patient.dob;
        patient.gender = gender || patient.gender;
        patient.phone = phone || patient.phone;
        patient.email = email || patient.email;

        const updatedPatient = await patient.save();
        res.json(updatedPatient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Patient
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Error 404: Patient not found. ' });
        await patient.remove();
        res.json({ message: 'Patient deleted.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPatient, getPatient, updatePatient, deletePatient };