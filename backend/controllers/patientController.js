const PatientRepository = require('../repositories/PatientRepository');

// Create Patient
const createPatient = async (req, res) => {
    const {
        photo,
        name,
        age,
        gender,
        species,
        breed,
        color,
        history,
        fname,
        lname,
        phone,
        email
    } = req.body;

    try {
        const patientData = ({
            userID: req.user.id,
            photo,
            name,
            age,
            gender,
            species,
            breed,
            color,
            history,
            fname,
            lname,
            phone,
            email
        });

        const patient = await PatientRepository.createPatient(patientData);

        res.status(201).json({
            photo: patient.photo,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            species: patient.species,
            breed: patient.breed,
            color: patient.color,
            history: patient.history,
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
        const patients = await PatientRepository.getPatient(req.params.id); // changed req.user.id to whats showing
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// get all patient (notes from jen, delete this later but added this and updated the get patient above)
const getAllPatient = async (req, res) => {
    try {
        const patients = await PatientRepository.getAllPatients();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// Update Patient
const updatePatient = async (req, res) => {
    try {
        const allowed = [
            'photo',
            'name',
            'age',
            'gender',
            'species',
            'breed',
            'color',
            'history',
            'fname',
            'lname',
            'phone',
            'email'
        ];
        const updates = {};
        allowed.forEach(k => { if (k in req.body) updates[k] = req.body[k]; });

        const patientId = req.params.id;
        const updated = await PatientRepository.updatePatient(
            patientId,
            updates,
            req.user?.id
        );

        if (!updated) return res.status(404).json({ message: 'Patient not found' });
        res.json(updated); // for front
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Patient
const deletePatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const result = await PatientRepository.deletePatient(patientId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPatient, getPatient, getAllPatient, updatePatient, deletePatient };