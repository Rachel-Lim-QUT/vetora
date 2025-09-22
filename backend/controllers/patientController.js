const Patient = require('../models/Patient');

// Create Patient
const createPatient = async (req, res) => {
    const { photo,
        name,
        age,
        gender,
        species,
        breed,
        color,
        fname,
        lname,
        phone,
        email } = req.body;
    try {
        const patient = await Patient.create({
            userID: req.user.id,
            photo,
            name,
            age,
            gender,
            species,
            breed,
            color,
            fname,
            lname,
            phone,
            email
        });

        res.status(201).json({
            photo: patient.photo,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            species: patient.species,
            breed: patient.breed,
            color: patient.color,
            fname: patient.fname,
            lname: patient.lname,
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
        const patients = await Patient.findById(req.params.id); // changed req.user,id to whats showing
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// get all patient (notes from jen, delete this later but added this and updated the get patient above)
const getAllPatient = async (req, res) => {
    try {
        const patients = await Patient.find();
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

module.exports = { createPatient, getPatient, getAllPatient, updatePatient, deletePatient };